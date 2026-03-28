import React from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import FormInvalidJson from 'components/FormManagement/FormInvalidJson';
import Input from '#web-components/components/FormControls/Input';
import Autocomplete from '#web-components/components/FormControls/Autocomplete';
import Checkbox from '#web-components/components/FormControls/Checkbox';
import DescriptionBox from '#web-components/components/DescriptionBox';
import { FormType } from '#web-components/components/Form/types';
import Roles from './components/Roles';
import styles from './FormFields.styles';

const useStyles = makeStyles(styles, { name: 'FormFields' });
interface FormFieldsProps {
  className?: string;
  isReadOnly?: boolean;
  isEditPage?: boolean;
}

export default function FormFields({ className, isReadOnly, isEditPage }: FormFieldsProps) {
  const classes = useStyles();
  const { control, formState: { errors } } = useFormContext();
  const { t } = useTranslation('domains');
  const { getValues } = useFormContext();

  const type = useWatch({ control, name: 'type' });

  if (getValues().jsonSchemeIsInValid) {
    return <FormInvalidJson />;
  }

  return (
    <form className={clsx(classes.form, className)}>
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            fullWidth
            required
            name={field.name}
            value={field.value || ''}
            onChange={field.onChange}
            isLabelShrink={!!field.value}
            error={errors[field.name]}
            className={classes.mb1}
            label={t('form.fields.businessName')}
            disabled={isReadOnly}
          />
        )}
      />
      <Controller
        name="path"
        control={control}
        render={({ field }) => (
          <Input
            fullWidth
            required
            name={field.name}
            value={field.value || ''}
            onChange={field.onChange}
            isLabelShrink={!!field.value}
            error={errors[field.name]}
            className={clsx(classes.mb1, classes.mt6)}
            label={t('form.fields.businessTitle')}
            disabled={isReadOnly || isEditPage}
          />
        )}
      />
      {!isReadOnly && (
        <DescriptionBox description={t('form.text.rule')} />
      )}
      <Controller
        name="type"
        control={control}
        rules={{ required: t('errors~form.fieldIsRequired') as string }}
        render={({ field }) => (
          <Autocomplete
            label={t('form.fields.type')}
            name={field.name}
            value={field.value}
            options={[
              { value: FormType.form, label: FormType.form },
              { value: FormType.card, label: FormType.card },
            ]}
            onChange={field.onChange}
            error={errors[field.name]}
            className={clsx(classes.mt6, classes.mb1)}
            disabled={isReadOnly}
          />
        )}
      />
      {type && type.value === FormType.card && (
        <>
          <div className={classes.mt6}>
            <Roles isReadOnly={isReadOnly} />
          </div>
          <Controller
            name="showOnCardList"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="showOnCardList"
                label={t('form.fields.showOnCardList')}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
                classes={{ label: clsx(classes.mt6, classes.mb1) }}
                disabled={isReadOnly}
              />
            )}
          />
        </>
      )}
    </form>
  );
}
