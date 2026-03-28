import React, { useState, useEffect } from 'react';
import { Box, ButtonGroup, makeStyles } from '@material-ui/core';
import WebEditor from 'components/WebEditor';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from 'types/common';
import { X_PATH } from 'constants/xPath';
import Modal from '#web-components/components/Modal';
import Button, { ButtonVariants } from '#web-components/components/Button';
import Typography from '#web-components/components/Typography';
import { PointUpIcon } from '#web-components/components/Icons';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import IconButton from '#web-components/components/IconButton';
import { ModalProps } from '#web-components/components/Modal/Modal';
import styles from './ModalWebEditor.styles';

const RATIO_HEIGHT = 208;
const RATIO_FULL_SCREEN_HEIGHT = 144;

const useStyles = makeStyles(styles, { name: 'ModalWebEditor' });

type ModalWebEditorProps = Pick<ModalProps, 'isOpen' | 'onOpenChange'> &
{
  value: string,
  onSave: () => void,
  onChangeEditor: (value: string) => void,
  isReadonly?: boolean
};

export default function ModalWebEditor({
  isOpen,
  value,
  onOpenChange,
  onChangeEditor,
  onSave,
  isReadonly,
}: ModalWebEditorProps) {
  const classes = useStyles();
  const { t } = useTranslation('domains');
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: { key: string; }) => {
      if (e.key === 'Escape' && !showErrorModal) {
        setFullScreen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showErrorModal]);

  const handleSave = () => {
    if (hasError) {
      setShowErrorModal(true);
      return;
    }
    onSave();
    onOpenChange(false);
  };

  const handleSubmit = () => {
    onSave();
    onOpenChange(false);
    setShowErrorModal(false);
  };

  return (
    <>
      <Modal
        noPadding
        disableEscapeKeyDown
        disableBackdropClick
        scroll="paper"
        isOpen={isOpen}
        fullScreen={fullScreen}
        onOpenChange={onOpenChange}
      >
        <Box className={classes.modalHeader}>
          <Typography variant="h5">{isReadonly
            ? t('process.text.viewScript') : t('process.text.editScript')}
          </Typography>
          <IconButton onClick={() => setFullScreen(!fullScreen)}>
            {fullScreen
              ? <FullscreenExitIcon data-xpath={X_PATH.fullscreenExit} />
              : <FullscreenIcon data-xpath={X_PATH.fullscreen} />}
          </IconButton>
        </Box>
        <WebEditor
          value={value}
          onChange={onChangeEditor}
          onValidate={setHasError}
          language={LANGUAGES.GROOVY}
          path="D:/file.groovy"
          heightRatio={fullScreen ? RATIO_FULL_SCREEN_HEIGHT : RATIO_HEIGHT}
          isReadOnly={isReadonly}
        />
        <ButtonGroup classes={{ root: classes.btnGroupRoot }}>
          {!isReadonly && (
          <Button size="large" variant={ButtonVariants.primary} onClick={handleSave}>
            {t('process.actions.save')}
          </Button>
          )}
          <Button size="large" variant={ButtonVariants.secondary} onClick={() => onOpenChange(false)}>
            {t('process.actions.close')}
          </Button>
        </ButtonGroup>
      </Modal>
      <Modal
        isPopUp
        disableEscapeKeyDown
        disableBackdropClick
        isOpen={showErrorModal}
        onOpenChange={setShowErrorModal}
        onSubmit={handleSubmit}
        submitText={t('process.text.save')}
        cancelText={t('process.text.continueEditing')}
      >
        <PointUpIcon size={56} />
        <Typography variant="h2" className={classes.title}>{t('process.text.saveScript')}</Typography>
        <Typography variant="textRegular">{t('process.text.scriptContainsErrors')}</Typography>
      </Modal>
    </>
  );
}
