import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import { Box, makeStyles, ButtonGroup } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { notify, STATUSES } from 'reapop';
import { isMaster as isMasterVersion } from 'utils/versions';
import useVersion from 'hooks/useVersion';
import { LANGUAGES } from 'types/common';
import RouterPrompt from '#shared/utils/RouterPrompt';
import InlineButton from '#web-components/components/InlineButton';
import {
  NotificationWarningIcon, PointUpIcon,
} from '#web-components/components/Icons';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Typography from '#web-components/components/Typography';
import Modal from '#web-components/components/Modal';
import Button, { ButtonVariants } from '#web-components/components/Button';
import WebEditor from 'components/WebEditor';
import ComponentError from 'components/ComponentError';
import {
  getTableDataModelClean,
  getTableDataModelRequest,
  selectDataModel,
  selectDataModelCriticalError,
  selectDataModelIsLoaded,
  updateTableDataModelRequest,
} from 'store/tables';
import { APP_URL_PREFIX } from 'constants/routes';
import styles from './TableStructureEditor.styles';

const RATIO_HEIGHT = 460;
const RATIO_FULL_SCREEN_HEIGHT = 72;

const useStyles = makeStyles(styles, { name: 'TableStructureEditor' });

export default function TableStructureEditor() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const dataModel = useSelector(selectDataModel);
  const dataModelError = useSelector(selectDataModelCriticalError);
  const isLoadedDataModel = useSelector(selectDataModelIsLoaded);
  const { t } = useTranslation('pages', { keyPrefix: 'tableList' });
  const { versionId } = useVersion();
  const isMaster = isMasterVersion(versionId);
  const [editorValue, setEditorValue] = useState<string>('');
  const [editorDefaultValue, setEditorDefaultValue] = useState<string>(dataModel);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(false);

  const editorHeightRatio = useMemo(() => {
    if (fullScreen) {
      return isMaster ? RATIO_FULL_SCREEN_HEIGHT : RATIO_FULL_SCREEN_HEIGHT * 2;
    }
    return RATIO_HEIGHT;
  }, [fullScreen, isMaster]);

  const hasChanges = useMemo(() => {
    return dataModel === editorValue;
  }, [dataModel, editorValue]);

  const setEditorValueFromDataModal = useCallback(() => {
    setEditorDefaultValue(dataModel);
    setEditorValue(dataModel);
  }, [dataModel]);

  const handleChange = useCallback((value: string) => {
    setEditorValue(value);
  }, []);

  const handleFullScreenMode = useCallback(() => {
    setFullScreen(!fullScreen);
    setEditorDefaultValue(editorValue);
  }, [editorValue, fullScreen]);

  const resetToDefault = useCallback(() => {
    setShowConfirmationModal(false);
    setEditorValueFromDataModal();
    dispatch(notify(t('text.currentChangesAreCancelled'), STATUSES.success));
  }, [setEditorValueFromDataModal, dispatch, t]);

  const handleShowConfirmationModal = useCallback(() => {
    setShowConfirmationModal(true);
    setEditorDefaultValue(editorValue);
  }, [editorValue]);

  const handleSubmit = useCallback(() => {
    dispatch(updateTableDataModelRequest({ xml: editorValue, versionId }));
  }, [dispatch, editorValue, versionId]);

  useEffect(() => {
    setEditorValueFromDataModal();
  }, [setEditorValueFromDataModal]);

  useEffect(() => {
    dispatch(getTableDataModelRequest(versionId));
    return () => {
      dispatch(getTableDataModelClean());
    };
  }, [dispatch, versionId]);

  const WebEditorMemo = useMemo(() => {
    if (isLoadedDataModel) {
      return (
        <WebEditor
          value={editorDefaultValue}
          onChange={handleChange}
          onValidate={setHasError}
          language={LANGUAGES.XML}
          heightRatio={editorHeightRatio}
          isReadOnly={isMaster}
          path="inmemory://file.xml"
        />
      );
    }
    return null;
  }, [isLoadedDataModel, editorDefaultValue, handleChange, editorHeightRatio, isMaster]);

  const ButtonGroupsMemo = useMemo(() => (
    /* TODO: change after completing MDTUDDM-22230 */
    <ButtonGroup classes={{ root: classes.btnGroupRoot }}>
      <Button
        disabled={hasChanges || hasError}
        variant={ButtonVariants.primary}
        size="large"
        onClick={handleSubmit}
      >
        {t('actions.saveChanges')}
      </Button>
      <Button
        disabled={hasChanges}
        variant={ButtonVariants.secondary}
        size="large"
        onClick={handleShowConfirmationModal}
      >
        {t('actions.undoChanges')}
      </Button>
    </ButtonGroup>
  ), [classes.btnGroupRoot, hasChanges, hasError, handleShowConfirmationModal, handleSubmit, t]);

  const FullScreenModal = useMemo(() => (
    <Modal
      fullScreen
      noPadding
      disableEscapeKeyDown
      disableBackdropClick
      scroll="paper"
      isOpen={fullScreen}
      onOpenChange={setFullScreen}
    >
      <Box className={classes.modalBox}>
        <Typography variant="h5">{t('text.structureDescriptionFile')}</Typography>
        <InlineButton
          leftIcon={<FullscreenExitIcon />}
          onLinkClick={handleFullScreenMode}
          classes={{
            link: classes.link,
          }}
        >
          {t('actions.collapse')}
        </InlineButton>
      </Box>

      {WebEditorMemo}

      {!isMaster && (
        <Box className={classes.modalBox}>
          {ButtonGroupsMemo}
        </Box>
      )}
    </Modal>
  ), [ButtonGroupsMemo, WebEditorMemo, classes.link, classes.modalBox, fullScreen, handleFullScreenMode, isMaster, t]);

  const ConfirmationModal = useMemo(() => (
    <Modal
      isPopUp
      disableEscapeKeyDown
      disableBackdropClick
      isOpen={showConfirmationModal}
      onOpenChange={resetToDefault}
      onSubmit={() => setShowConfirmationModal(false)}
      submitText={t('actions.continueEditing')}
      cancelText={t('actions.undoChanges')}
    >
      <PointUpIcon size={56} />
      <Typography variant="h2" className={classes.title}>{t('text.undoChanges')}?</Typography>
      <Typography variant="textRegular">{t('text.undoChangesText')}</Typography>
    </Modal>
  ), [classes.title, resetToDefault, showConfirmationModal, t]);

  if (dataModelError) {
    return (
      <ComponentError
        icon={<NotificationWarningIcon size={56} />}
        text={dataModelError}
      />
    );
  }

  return (
    <>
      <Box className={classes.box}>
        <InlineButton
          leftIcon={<FullscreenIcon />}
          onLinkClick={handleFullScreenMode}
          classes={{
            link: classes.link,
          }}
        >
          {t('actions.expand')}
        </InlineButton>
        {!isMaster && ButtonGroupsMemo}
      </Box>

      {!fullScreen && WebEditorMemo}

      {fullScreen && FullScreenModal}

      {ConfirmationModal}

      <RouterPrompt
        title={t('text.leavePage')}
        okText={t('text.leave')}
        cancelText={t('text.stay')}
        enabled={!hasChanges}
        text={t('text.fileWasChanged')}
        baseName={APP_URL_PREFIX}
      />
    </>
  );
}
