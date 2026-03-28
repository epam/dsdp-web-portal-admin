import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { CreateVersion } from 'types/versions';
import Typography from '#web-components/components/Typography';
import Modal from '#web-components/components/Modal';
import Input from '#web-components/components/FormControls/Input';
import styles from './ModalCreateVersion.styles';

const REGEX_VALID_NAME = /^[0-9a-zа-щьюяґєіїыэъ-]+$/;
const REGEX_VALID_DESCRIPTION = /^[^"]+$/;

const useStyles = makeStyles(styles, { name: 'ModalCreateVersion' });

interface ModalCreateVersionProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onModalSubmit: (data: CreateVersion) => void;
}

export default function ModalCreateVersion({
  isOpen,
  onOpenChange,
  onModalSubmit,
}: ModalCreateVersionProps) {
  const classes = useStyles();
  const { t, i18n } = useTranslation('components', { keyPrefix: 'modal.createCandidateVersion' });

  const { control, handleSubmit, formState: { errors } } = useForm({
    shouldUnregister: true,
    defaultValues: {
      name: '',
      description: '',
    },
  });

  return (
    <Modal
      hasCloseBtn
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      scroll="body"
      title={t('text.createNewRequest')}
      cancelText={t('actions.cancel')}
      submitText={t('actions.create')}
      onSubmit={handleSubmit(onModalSubmit)}
    >
      <>
        <Typography variant="textRegular" className={classes.modalDescription}>
          {t('text.createNewRequestDescription')}
        </Typography>
        <Box className={classes.input}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: i18n.t('errors~form.fieldIsRequired') as string,
              minLength: {
                value: 3,
                message: i18n.t('errors~form.invalidField') as string,
              },
              maxLength: {
                value: 32,
                message: i18n.t('errors~form.invalidField') as string,
              },
              pattern: {
                value: REGEX_VALID_NAME,
                message: i18n.t('errors~form.invalidField') as string,
              },
            }}
            render={({ field }) => (
              <Input
                isLabelShrink
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                error={errors.name}
                label={t('fields.versionName')}
                placeholder={t('fields.versionNamePlaceholder')}
                description={t('fields.versionNameRule')}
              />
            )}
          />
        </Box>
        <Box className={classes.input}>
          <Controller
            name="description"
            control={control}
            rules={{
              maxLength: {
                value: 512,
                message: i18n.t('errors~form.invalidField') as string,
              },
              pattern: {
                value: REGEX_VALID_DESCRIPTION,
                message: i18n.t('errors~form.invalidField') as string,
              },
            }}
            render={({ field }) => (
              <Input
                isLabelShrink
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                error={errors.description}
                label={t('fields.descriptionOfChange')}
                placeholder={t('fields.descriptionOfChangePlaceholder')}
                description={t('fields.descriptionOfChangeRule')}
                textArea={{
                  rows: 1,
                  autoExpand: true,
                }}
              />
            )}
          />
        </Box>
      </>
    </Modal>
  );
}
