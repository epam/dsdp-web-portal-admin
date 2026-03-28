import React from 'react';
import { makeStyles } from '@material-ui/core';
import zIndex from '@material-ui/core/styles/zIndex';
import { useTranslation } from 'react-i18next';
import isBoolean from 'lodash/isBoolean';
import Modal from '#web-components/components/Modal';
import { NotificationWarningIcon, ThumbUp } from '#web-components/components/Icons';
import Typography from '#web-components/components/Typography';

import styles from './ModalResultAfterSaveChanges.styles';

interface ModalResultAfterSaveChangesProps {
  hasConflicts: boolean | null;
  onClose: () => void;
  title?: string;
  description?: string;
  textButton?: string;
  hidden?: boolean;
}

const useStyles = makeStyles(styles, { name: 'ModalResultAfterSaveChanges' });

export default function ModalResultAfterSaveChanges({
  onClose,
  hasConflicts,
  title,
  description,
  textButton,
  hidden,
}: ModalResultAfterSaveChangesProps) {
  const classes = useStyles();
  const { t } = useTranslation('components', { keyPrefix: 'modal.nonConflicts' });

  if (isBoolean(hasConflicts) && !hidden) {
    const isNoConflicts = hasConflicts === false;

    return (
      <Modal
        isOpen
        isPopUp
        disableBackdropClick
        modalzIndex={zIndex.tooltip + 1}
        onOpenChange={onClose}
        icon={isNoConflicts ? <ThumbUp size={56} /> : <NotificationWarningIcon size={56} />}
        title={isNoConflicts ? t('text.title') : title}
        cancelText={isNoConflicts ? t('text.button') : textButton}
        scroll="body"
      >
        <Typography variant="textRegular" className={classes.description}>
          {isNoConflicts ? t('text.description') : description}
        </Typography>
      </Modal>
    );
  }
  return null;
}
