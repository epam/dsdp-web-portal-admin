import React, { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import FormInvalidJson from 'components/FormManagement/FormInvalidJson';
import Input from '#web-components/components/FormControls/Input';
import Typography from '#web-components/components/Typography';
import { isFormTypeCard } from '#web-components/utils';
import styles from './FormCode.styles';

const useStyles = makeStyles(styles, { name: 'FormCode' });
interface FormCodeProps {
  isReadOnly?: boolean;
}

export default function FormCode({ isReadOnly }: FormCodeProps) {
  const classes = useStyles();
  const { t } = useTranslation('pages', { keyPrefix: 'editForm' });
  const {
    register, getValues, setValue, control, watch,
  } = useFormContext();
  const {
    jsonSchemeIsInValid,
    title: titleValue,
    path: pathValue,
    type: typeValue,
    roles: rolesValue,
    showOnCardList: showOnCardListValue,
  } = getValues();
  const isJsonValid = watch('jsonSchemeIsInValid');
  let { formSchema: formSchemaValue } = getValues();

  if (isFormTypeCard(typeValue.value)) {
    formSchemaValue = { ...formSchemaValue, roles: rolesValue, showOnCardList: showOnCardListValue };
  } else {
    delete formSchemaValue?.roles;
    delete formSchemaValue?.showOnCardList;
  }

  const fullJson = useMemo(() => JSON.stringify({
    ...formSchemaValue,
    title: titleValue,
    path: pathValue,
    type: typeValue.value,
  }, null, 4), [formSchemaValue, titleValue, pathValue, typeValue.value]);

  useEffect(() => {
    register('jsonScheme');
    register('jsonSchemeIsInValid', { value: false });
  }, [register]);

  useEffect(() => {
    if (!jsonSchemeIsInValid) {
      setValue('jsonScheme', fullJson);
    }
  }, [fullJson, jsonSchemeIsInValid, setValue]);

  const onChange = useCallback((controllerOnChange) => (value: string | number | undefined | null) => {
    try {
      const {
        title, path, type, roles, showOnCardList, ...formSchema
      } = JSON.parse(value as string);
      setValue('formSchema', formSchema);
      setValue('title', title, { shouldDirty: true, shouldValidate: true });
      setValue('path', path, { shouldDirty: true, shouldValidate: true });
      setValue('type', { value: type, label: type });
      setValue('roles', roles);
      setValue('showOnCardList', showOnCardList);
      setValue('jsonSchemeIsInValid', false);
    } catch {
      setValue('jsonSchemeIsInValid', true);
    }
    controllerOnChange(value);
  }, [setValue]);

  return (
    <div className={classes.root}>
      {isJsonValid && <FormInvalidJson />}
      <Typography variant="textSmallCompact">{t('fields.formCode')}</Typography>
      <Controller
        name="jsonScheme"
        control={control}
        render={({ field }) => (
          <Input
            className={classes.code}
            isLabelShrink
            name={field.name}
            value={field.value}
            onChange={onChange(field.onChange)}
            disabled={isReadOnly}
            textArea={{
              autoExpand: false,
            }}
          />
        )}
      />
    </div>
  );
}
