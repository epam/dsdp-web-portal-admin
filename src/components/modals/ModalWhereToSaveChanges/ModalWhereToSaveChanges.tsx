import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Modal from '#web-components/components/Modal';
import Button, { ButtonVariants } from '#web-components/components/Button';
import { CloseIcon, PointUpIcon } from '#web-components/components/Icons';
import Typography from '#web-components/components/Typography';
import InlineButton from '#web-components/components/InlineButton/InlineButton';
import zIndex from '@material-ui/core/styles/zIndex';

import styles from './ModalWhereToSaveChanges.styles';

interface ModalWhereToSaveChangesProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOpenCreateVersion: (isOpen: boolean) => void;
  onChangesToMaster: () => void;
  description: string,
}

const useStyles = makeStyles(styles, { name: 'ModalWhereToSaveChanges' });

export default function ModalWhereToSaveChanges({
  isOpen,
  onOpenChange,
  onChangesToMaster,
  onOpenCreateVersion,
  description,
}: ModalWhereToSaveChangesProps) {
  const classes = useStyles();
  const { t } = useTranslation('components', { keyPrefix: 'modal.whereToSaveChanges' });

  const handleCreateCandidateVersion = useCallback(() => {
    onOpenChange(false);
    onOpenCreateVersion(true);
  }, [onOpenCreateVersion, onOpenChange]);

  return (
    <Modal
      isPopUp
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scroll="body"
      modalzIndex={zIndex.tooltip + 1}
    >
      <PointUpIcon size={56} />
      <Typography variant="h2" className={classes.title}>
        {t('text.title')}
      </Typography>
      <Typography variant="textRegular" className={classes.description}>
        {description}
      </Typography>
      <Button
        variant={ButtonVariants.primary}
        className={classes.btn}
        onClick={handleCreateCandidateVersion}
        size="large"
      >
        {t('actions.createCandidateVersion')}
      </Button>
      <Button
        variant={ButtonVariants.secondary}
        className={classes.btn}
        onClick={onChangesToMaster}
        size="large"
      >
        {t('actions.continueMasterVersion')}
      </Button>
      <InlineButton
        size="medium"
        leftIcon={<CloseIcon />}
        onLinkClick={() => onOpenChange(false)}
        classes={{
          link: classes.link,
        }}
      >
        {t('actions.cancel')}
      </InlineButton>
    </Modal>
  );
}
