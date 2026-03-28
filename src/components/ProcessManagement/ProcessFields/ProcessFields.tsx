import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { ProcessFormData } from 'types/processes';
import { useFormContext, Controller } from 'react-hook-form';
import Input from '#web-components/components/FormControls/Input';
import ProcessValidationMessage from '../ProcessValidationMessage';
import styles from './ProcessFields.styles';

const useStyles = makeStyles(styles, { name: 'ProcessFields' });
interface ProcessFieldsProps {
  className?: string;
  isReadOnly?: boolean;
  isEditPage?: boolean;
}

export default function ProcessFields({ className, isReadOnly, isEditPage }: ProcessFieldsProps) {
  const classes = useStyles();
  const { control, formState: { errors } } = useFormContext();
  const { t } = useTranslation('domains');

  const {
    watch,
  } = useFormContext<ProcessFormData>();
  const isXmlValid = watch('isXmlValid');

  if (!isXmlValid) {
    return (
      <ProcessValidationMessage />
    );
  }

  return (
    <form className={clsx(classes.form, className)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            fullWidth
            name={field.name}
            value={field.value || ''}
            onChange={field.onChange}
            isLabelShrink={!!field.value}
            error={errors[field.name]}
            className={classes.textField}
            label={t('process.fields.businessTitle')}
            disabled={isReadOnly}
            required
            description={!isReadOnly ? t('process.text.rule.title') : undefined}
          />
        )}
      />
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            fullWidth
            name={field.name}
            value={field.value || ''}
            onChange={field.onChange}
            isLabelShrink={!!field.value}
            error={errors[field?.name]}
            className={clsx(classes.textField, classes.margin)}
            label={t('process.fields.businessName')}
            disabled={isReadOnly || isEditPage}
            required
            description={(!isReadOnly && !isEditPage) ? t('process.text.rule.name') : undefined}
          />
        )}
      />
    </form>
  );
}
