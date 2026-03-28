import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Modal from '#web-components/components/Modal';
import { TrashCanIcon } from '#web-components/components/Icons';
import Typography from '#web-components/components/Typography';
import zIndex from '@material-ui/core/styles/zIndex';

import styles from './ModalDeleteI18n.styles';

interface ModalDeleteI18nProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onDelete: () => void;
  i18nTitle?: string,
}

const useStyles = makeStyles(styles, { name: 'ModalDeleteI18n' });

export default function ModalDeleteI18n({
  isOpen,
  onOpenChange,
  onDelete,
  i18nTitle,
} : ModalDeleteI18nProps) {
  const classes = useStyles();
  const { t } = useTranslation('pages', { keyPrefix: 'i18nList.modal.deleteI18n' });

  return (
    <Modal
      isPopUp
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scroll="body"
      cancelText={t('actions.cancel')}
      submitText={t('actions.delete')}
      onSubmit={onDelete}
      modalzIndex={zIndex.tooltip + 1}
    >
      <Typography variant="h1">
        <TrashCanIcon />
      </Typography>
      <Typography variant="h2" className={classes.title}>
        {t('title')}
      </Typography>
      <Typography variant="textRegular" className={classes.description}>
        {t('description', { title: i18nTitle })}
      </Typography>
    </Modal>
  );
}
