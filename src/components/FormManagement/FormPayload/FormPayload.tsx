import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTheme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import FormInvalidJson from 'components/FormManagement/FormInvalidJson';
import Input from '#web-components/components/FormControls/Input';
import { Formio } from '#web-components/exports/formio';
import { WebformInstance } from '#web-components/components/Form/types';

export default function FormPayload() {
  const { t } = useTranslation('components', { keyPrefix: 'formLayout' });
  const [payloadText, setPayloadText] = useState('');
  const { getValues } = useFormContext();
  const theme = useTheme();
  const { formSchema, formPayload, jsonSchemeIsInValid } = getValues();

  useEffect(() => {
    if (formSchema.components) {
      const instance = Formio.createForm(
        document.createElement('div'),
        { components: formSchema.components },
        { theme },
      );
      instance.then((form: WebformInstance) => {
        const currentForm = form;
        currentForm.on('change', () => {
          setPayloadText(JSON.stringify(currentForm.submission?.data, null, 4));
        });
        currentForm.submission = formPayload;
      });
    }
  }, [formPayload, formSchema, theme]);

  if (jsonSchemeIsInValid) {
    return <FormInvalidJson />;
  }

  return (
    <div>
      <Input
        label={t('tabsContent.queryTitle')}
        name="payload"
        disabled
        value={payloadText}
        textArea={{
          autoExpand: true,
        }}
      />
    </div>
  );
}
