import React, { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import { removeCustomClass } from 'utils';
import FormInvalidJson from 'components/FormManagement/FormInvalidJson';
import Form from '#web-components/components/Form';
import { FormSubmission } from '#web-components/components/Form/types';
import { Formio } from '#web-components/exports/formio';
import { prepareSubmissions } from '#web-components/components/Form/utils';
import { getEvalContext, getResourceBundlesFromNamespaces } from '#shared/utils/common';
import { FORM_RENDERER_NS, REGULATION_NS, SERVER_MESSAGES_NS } from '#shared/constants/common';
import styles from './FormPreview.styles';

const useStyles = makeStyles(styles, { name: 'FormPreview' });
Formio.setBaseUrl(ENVIRONMENT_VARIABLES?.apiUrl || window.location.origin);
const formEvalContext = getEvalContext(ENVIRONMENT_VARIABLES.language, ENVIRONMENT_VARIABLES.supportedLanguages);

export default function FormPreview() {
  const { register, getValues, setValue } = useFormContext();
  const { i18n } = useTranslation();
  const classes = useStyles();
  const components = getValues().formSchema?.components ?? [];
  const { formPayload, jsonSchemeIsInValid } = getValues();

  const handleChange = (submission: FormSubmission) => {
    setValue('formPayload', {
      data: prepareSubmissions(components, submission, { isFormData: true, forStorage: true })?.data,
    });
  };

  const formI18n = useMemo(() => ({
    bundle: getResourceBundlesFromNamespaces(
      i18n,
      [FORM_RENDERER_NS, REGULATION_NS],
      ENVIRONMENT_VARIABLES.supportedLanguages,
    ),
    t: i18n.getFixedT(i18n.language, [FORM_RENDERER_NS, SERVER_MESSAGES_NS]),
    language: i18n.language,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [i18n, i18n.language]);

  useEffect(() => {
    register('formSchema');
    register('formPayload');
  }, [register]);

  if (jsonSchemeIsInValid) {
    return <FormInvalidJson />;
  }

  return (
    <div className={classes.root}>
      <Form
        // fileServiceNonSupport
        components={removeCustomClass(components)}
        submissionData={formPayload}
        language={i18n.language}
        blackList={ENVIRONMENT_VARIABLES.emailBlacklist || []}
        onSubmit={() => { }}
        onChange={handleChange}
        invalidComponentValueMessage={i18n.t('errors~invalidComponentValue')}
        i18n={formI18n}
        evalContext={formEvalContext}
      />
    </div>
  );
}
