import React, { useCallback, useEffect } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';

import Modal from '#web-components/components/Modal';
import Button, { ButtonVariants } from '#web-components/components/Button';
import Input from '#web-components/components/FormControls/Input';

import styles from './EditGroupNameModal.styles';

const useStyles = makeStyles(styles, { name: 'EditGroupNameModal' });

interface Props {
  existingGroupNames: Array<string>;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (groupName: string) => void;
  groupFieldValue?: string;
  text: {
    title: string;
    groupFieldLabel: string;
    addButtonLabel: string;
  }
}

export const REGEX_VALID_NAME = /^[0-9A-Za-zа-щьюяґєіїА-ЯЬЮЯҐЄІЇ'’`,. —\-()/:;№]*$/;

export default function EditGroupNameModal(props: Props) {
  const {
    isOpen,
    onOpenChange,
    onSubmit,
    groupFieldValue,
    text,
    existingGroupNames,
  } = props;
  const classes = useStyles();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'processList' });
  const { groupFieldLabel, title, addButtonLabel } = text;
  const {
    control, handleSubmit, reset, formState: { errors, isValid },
  } = useForm({
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      groupName: groupFieldValue || '',
    },
  });
  const submitCallback = useCallback((data) => {
    reset({ groupName: data.groupName });
    onOpenChange(false);
    onSubmit(data.groupName);
  }, [onSubmit, onOpenChange, reset]);

  useEffect(() => {
    reset({ groupName: groupFieldValue || '' });
  }, [groupFieldValue, isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      hasCloseBtn
    >
      <Box mb={8} mt={6}>
        <Controller
          name="groupName"
          control={control}
          rules={{
            required: i18n.t('errors~form.fieldIsRequired') as string,
            minLength: {
              value: 3,
              message: i18n.t('errors~form.invalidField') as string,
            },
            maxLength: {
              value: 512,
              message: i18n.t('errors~form.invalidField') as string,
            },
            pattern: {
              value: REGEX_VALID_NAME,
              message: i18n.t('errors~form.invalidField') as string,
            },
            validate: (value) => (existingGroupNames.includes(value)
              ? t('modals.groupName.existsError') as string
              : true),
          }}
          render={({ field }) => (
            <Input
              isLabelShrink
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              error={errors.groupName}
              label={groupFieldLabel}
              placeholder={t('modals.groupName.placeholder')}
              description={t('modals.groupName.description')}
            />
          )}
        />
      </Box>
      { /* TODO: change after completing MDTUDDM-22230 */ }
      <Box className={classes.buttonBox}>
        <Button
          size="large"
          onClick={handleSubmit(submitCallback)}
          disabled={!isValid}
        >
          {addButtonLabel}
        </Button>
        <Button
          size="large"
          onClick={() => onOpenChange(false)}
          variant={ButtonVariants.secondary}
        >
          {t('modals.groupName.cancelButton')}
        </Button>
      </Box>
    </Modal>
  );
}
