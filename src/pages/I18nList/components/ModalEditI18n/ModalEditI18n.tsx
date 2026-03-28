import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  makeStyles, ButtonGroup, Box,
} from '@material-ui/core';
import zIndex from '@material-ui/core/styles/zIndex';
import Close from '@material-ui/icons/Close';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import FullscreenIcon from '@material-ui/icons/Fullscreen';

import Button, { ButtonVariants } from '#web-components/components/Button';
import IconButton from '#web-components/components/IconButton';
import Modal from '#web-components/components/Modal';
import Typography from '#web-components/components/Typography';
import Autocomplete from '#web-components/components/FormControls/Autocomplete';
import { ItemProps } from '#web-components/components/FormControls/Autocomplete/Autocomplete';

import { LANGUAGES } from 'types/common';
import WebEditor from 'components/WebEditor';
import { X_PATH } from 'constants/xPath';
import {
  getI18nByNameRequest,
  getI18nListRequest,
  selectI18nList,
  selectI18nByName,
} from 'store/i18n';
import useVersion from 'hooks/useVersion';
import { getLanguageNativeName } from 'utils/i18n';
import styles from './ModalEditI18n.styles';

export type ModalEditI18nProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  isNewI18n: boolean;
  onSubmit: () => void;
  i18nTitle?: string,
  fileContent: string,
  setFileContent: (fileContent: string) => void,
};

const useStyles = makeStyles(styles, { name: 'ModalDeleteI18n' });
const RATIO_HEIGHT = 528;
const RATIO_FULL_SCREEN_HEIGHT = 162;
const NEW_I18N_RATIO_FULL_SCREEN_HEIGHT = 264;

export default function ModalEditI18n({
  isOpen,
  onOpenChange,
  isNewI18n,
  onSubmit,
  i18nTitle,
  fileContent,
  setFileContent,
}: ModalEditI18nProps) {
  const { t } = useTranslation('pages', { keyPrefix: 'i18nList.modal.editI18n' });
  const dispatch = useDispatch();
  const classes = useStyles();

  const { versionId } = useVersion();
  const [currentFileContent, setCurrentFileContent] = useState<string>(fileContent);
  const [selectedI18n, setSelectedI18n] = useState<ItemProps>();
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const i18nList = useSelector(selectI18nList);
  const i18nContent = useSelector(selectI18nByName);

  // load i18n bundle list
  useEffect(() => {
    if (isNewI18n) {
      dispatch(getI18nListRequest(versionId));
    }
  }, [isNewI18n, dispatch, versionId]);

  const supportedLanguagesWithBundles = useMemo(() => {
    return i18nList.map((item) => (
      {
        value: item.name,
        label: getLanguageNativeName(item.name),
      }
    )).filter((item) => ENVIRONMENT_VARIABLES.supportedLanguages.some((language) => language === item.value));
  }, [i18nList]);

  // define default language
  useEffect(() => {
    if (isNewI18n) {
      const defaultLanguage = supportedLanguagesWithBundles.find(
        (element) => element.value === ENVIRONMENT_VARIABLES.language,
      );
      setSelectedI18n(defaultLanguage || supportedLanguagesWithBundles[0]);
    }
  }, [isNewI18n, supportedLanguagesWithBundles]);

  // select initial fileContent
  useEffect(() => {
    if (selectedI18n) {
      dispatch(getI18nByNameRequest({ name: selectedI18n?.value as string, versionId }));
    }
  }, [dispatch, selectedI18n, versionId]);

  useEffect(() => {
    if (isNewI18n) {
      setCurrentFileContent(i18nContent as string);
      setFileContent(i18nContent as string);
    } else {
      setCurrentFileContent(fileContent);
    }
  }, [isNewI18n, setFileContent, i18nContent, fileContent]);

  const editorHeightRatio = useMemo(() => {
    if (fullScreen) {
      return isNewI18n ? NEW_I18N_RATIO_FULL_SCREEN_HEIGHT : RATIO_FULL_SCREEN_HEIGHT;
    }
    return RATIO_HEIGHT;
  }, [fullScreen, isNewI18n]);

  const updateSelectedI18n = useCallback((value: ItemProps) => {
    if (value !== selectedI18n) {
      setSelectedI18n(value);
    }
  }, [selectedI18n]);

  // set Escape handler that closes fullscreen mode instead of closing whole modal
  useEffect(() => {
    const handleKeyDown = (e: { key: string; }) => {
      if (e.key === 'Escape') {
        setFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // set fullScreen to false every time popup reopens
  useEffect(() => {
    if (isOpen) {
      setFullScreen(false);
    }
  }, [isOpen]);

  return (
    <Modal
      noPadding
      fullScreen={fullScreen}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      disableEscapeKeyDown
      disableBackdropClick
      modalzIndex={zIndex.tooltip + 1}
      scroll="paper"
      classes={{ paper: fullScreen ? '' : classes.paper }}
    >
      <Box className={fullScreen ? classes.modalFullScreen : classes.modal}>
        <Box className={fullScreen ? classes.modalHeaderFullScreen : ''}>
          <Typography variant={fullScreen ? 'h5' : 'h2'}>
            {t(isNewI18n ? 'title.create' : 'title.edit', { title: i18nTitle })}
          </Typography>
          <Box>
            <IconButton
              onClick={() => setFullScreen(!fullScreen)}
              size={fullScreen ? 'medium' : 'large'}
              className={fullScreen ? '' : classes.fullScreenBtn}
            >
              {fullScreen
                ? <FullscreenExitIcon data-xpath={X_PATH.fullscreenExit} />
                : <FullscreenIcon data-xpath={X_PATH.fullscreen} />}
            </IconButton>
            <IconButton
              onClick={() => onOpenChange(false)}
              size={fullScreen ? 'medium' : 'large'}
              className={fullScreen ? '' : classes.closeModalBtn}
            >
              <Close data-xpath={X_PATH.closeModal} />
            </IconButton>
          </Box>
        </Box>
        <Box className={fullScreen ? classes.webEditorFullScreen : classes.webEditor}>
          {isNewI18n && (
            <Autocomplete
              name="selectLanguage"
              value={selectedI18n as ItemProps}
              options={supportedLanguagesWithBundles}
              onChange={(value) => updateSelectedI18n(value as ItemProps)}
              label={t('autocomplete.label')}
              className={classes.existedLanguages}
            />
          )}
          <WebEditor
            value={currentFileContent}
            onChange={setFileContent}
            onValidate={setHasError}
            language={LANGUAGES.JSON}
            heightRatio={editorHeightRatio}
            path="inmemory://file.json"
          />
        </Box>
        <ButtonGroup classes={{ root: fullScreen ? classes.btnGroupRootFullScreen : classes.btnGroupRoot }}>
          <Button
            disabled={hasError}
            variant={ButtonVariants.primary}
            size={fullScreen ? 'medium' : 'large'}
            onClick={onSubmit}
          >
            {t('actions.save')}
          </Button>
          <Button
            variant={ButtonVariants.secondary}
            size={fullScreen ? 'medium' : 'large'}
            onClick={() => onOpenChange(false)}
          >
            {t('actions.cancel')}
          </Button>
        </ButtonGroup>
      </Box>
    </Modal>
  );
}
