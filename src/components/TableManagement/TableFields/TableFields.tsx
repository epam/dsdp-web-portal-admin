import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useFormContext, Controller } from 'react-hook-form';
import { Box, makeStyles } from '@material-ui/core';
import Input from '#web-components/components/FormControls/Input';
import Checkbox from '#web-components/components/FormControls/Checkbox';
import styles from './TableFields.styles';

const useStyles = makeStyles(styles, { name: 'TableFields' });
interface TableFieldsProps {
  className?: string;
  isReadOnly?: boolean;
}

export default function TableFields({ className, isReadOnly }: TableFieldsProps) {
  const classes = useStyles();
  const { control, formState: { errors } } = useFormContext();
  const { t } = useTranslation('domains');

  return (
    <form className={clsx(classes.form, className)}>
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
            error={errors[field.name]}
            className={classes.textField}
            label={t('registry.common.name')}
            disabled={isReadOnly}
            required
          />
        )}
      />
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <Input
            fullWidth
            name={field.name}
            value={field.value || ''}
            onChange={field.onChange}
            isLabelShrink={!!field.value}
            error={errors[field.name]}
            className={clsx(classes.textField, classes.margin)}
            label={t('registry.common.description')}
            disabled={isReadOnly}
          />
        )}
      />
      <Box className={classes.checkboxes}>
        <Controller
          name="objectReference"
          control={control}
          render={({ field }) => (
            <Checkbox
              id={field.name}
              name={field.name}
              value={field.value || false}
              onChange={field.onChange}
              error={errors[field.name]}
              label={t('registry.common.objectReference')}
              disabled={isReadOnly}
            />
          )}
        />
      </Box>
    </form>
  );
}
