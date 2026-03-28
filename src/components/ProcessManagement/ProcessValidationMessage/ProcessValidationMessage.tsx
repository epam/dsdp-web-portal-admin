import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ProcessFormData } from 'types/processes';
import FlashMessage from '#web-components/components/FlashMessage';

export default function ProcessValidationMessage() {
  const { t } = useTranslation('domains');
  const {
    watch,
  } = useFormContext<ProcessFormData>();
  const isXmlValid = watch('isXmlValid');
  return !isXmlValid
    ? (
      <FlashMessage
        status="error"
        title={t('process.validation.wrongXml.title')}
        message={t('process.validation.wrongXml.message')}
      />
    )
    : null;
}
