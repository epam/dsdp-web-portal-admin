import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Form } from 'types/form';
import { createBuilderAndPreviewComponents } from 'utils';
import { COMPONENTS_WITH_OLD_VIEW_IN_BUILDER } from 'constants/formBuilder';
import { removeCustomClass } from 'utils/form';
import { checkUniqueKeys } from '#web-components/utils/form';

import FormInvalidJson from 'components/FormManagement/FormInvalidJson';
import FormInvalidUnique from 'components/FormManagement/FormInvalidUnique';

import { Formio } from '#web-components/exports/formio';
import { FormBuilder as FormioFormBuilder, FormioModule } from '#web-components/components/Form';
import { getResourceBundlesFromNamespaces } from '#shared/utils/common';
import { FORM_RENDERER_NS, REGULATION_NS, SERVER_MESSAGES_NS } from '#shared/constants/common';

// TODO: fix select to work properly with builder, create custom select in selectPreview
const FormBuilderModule = {
  ...FormioModule,
  components: createBuilderAndPreviewComponents(FormioModule.components, COMPONENTS_WITH_OLD_VIEW_IN_BUILDER),
};
Formio.setBaseUrl(ENVIRONMENT_VARIABLES?.apiUrl || window.location.origin);

export default function FormBuilder() {
  const { setValue, getValues } = useFormContext();
  const { t, i18n } = useTranslation('components', { keyPrefix: 'formBuilder' });
  const [isUniqueKeys, setUniqueKeys] = useState(true);
  const handleChange = useCallback((schema: Form) => {
    const { components } = schema;
    setValue('formPayload', null);
    setValue('formSchema', { ...schema, components: removeCustomClass(components) });
    setUniqueKeys(!checkUniqueKeys(getValues()?.formSchema?.components));
  }, [getValues, setValue]);
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
    Formio.use(FormBuilderModule);
    return () => {
      Formio.use(FormioModule);
    };
  }, []);

  if (getValues().jsonSchemeIsInValid) {
    return <FormInvalidJson />;
  }

  if (!isUniqueKeys) {
    return <FormInvalidUnique />;
  }

  return (
    <FormioFormBuilder
      fileServiceNonSupport
      formSchema={getValues().formSchema}
      onChange={handleChange}
      language={i18n.language}
      localization={{
        basicTitle: t('text.legacyComponentsListTitle'),
        advancedTitle: t('text.experimentalComponentsListTitle'),
        premiumTitle: t('text.basicComponentsListTitle'),
        autocompleteDescription: t('text.autocompleteDescription'),
        invalidComponentValueMessage: i18n.t('errors~invalidComponentValue'),
      }}
      fileMaxSize={ENVIRONMENT_VARIABLES.digitalDocumentsMaxFileSize}
      fileMaxTotalSize={ENVIRONMENT_VARIABLES.digitalDocumentsMaxTotalFileSize}
      i18n={formI18n}
    />
  );
}
