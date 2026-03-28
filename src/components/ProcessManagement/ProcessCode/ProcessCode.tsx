import { makeStyles } from '@material-ui/core';
import React, { useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getProcessObj } from 'utils/process';
import { ProcessFormData } from 'types/processes';
import Input from '#web-components/components/FormControls/Input';
import Typography from '#web-components/components/Typography';
import styles from './ProcessCode.styles';
import ProcessValidationMessage from '../ProcessValidationMessage';

type ProcessCodeProps = {
  isReadOnly?: boolean;
};

const useStyles = makeStyles(styles, { name: 'ProcessCode' });

export default function ProcessCode({ isReadOnly }: ProcessCodeProps) {
  const classes = useStyles();
  const { t } = useTranslation('domains');
  const {
    control, setValue,
  } = useFormContext<ProcessFormData>();

  const onChange = useCallback((controllerOnChange) => (value: string | number | undefined | null) => {
    controllerOnChange(value);
    getProcessObj(value as string)
      .then(({ id, name }) => {
        setValue('isXmlValid', true);
        setValue('name', id, { shouldDirty: true, shouldValidate: true });
        setValue('title', name, { shouldDirty: true, shouldValidate: true });
      })
      .catch(() => {
        setValue('isXmlValid', false);
      });
  }, [setValue]);
  return (
    <div className={classes.root}>
      <ProcessValidationMessage />
      <Typography variant="textSmallCompact">{t('process.fields.processCode')}</Typography>
      <Controller
        name="formProcessString"
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
              autoExpand: true,
            }}
          />
        )}
      />
    </div>
  );
}
