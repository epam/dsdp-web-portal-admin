import React, { useCallback, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import FormBuilder from 'components/FormManagement/FormBuilder';
import FormFields from 'components/FormManagement/FormFields';
import { Form as FormSchema, FormDetails, FormModeCode } from 'types/form';
import { ROUTES } from 'constants/routes';
import { formPathRules, isRequiredRules } from 'constants/validationRules';
import FormPreview from 'components/FormManagement/FormPreview';
import FormPayload from 'components/FormManagement/FormPayload';
import FormCode from 'components/FormManagement/FormCode';
import {
  createFormRequest,
  getFormByNameClean,
  getFormByNameRequest,
  selectCreateFormIsLoading,
  selectForm,
  selectHasConflicts,
} from 'store/form';
import { createFieldCopy } from 'utils';
import useVersion from 'hooks/useVersion';
import useEntityMode from 'hooks/useEntityMode';
import { getRoutePathWithVersion, isMaster as isMasterVersion } from 'utils/versions';
import { createFormError, setHasConflicts } from 'store/form/slice';
import { ERROR_TYPE } from '#shared/types/common';
import { FormType } from '#web-components/components/Form/types';
import { SUBMIT_BUTTON } from 'constants/formBuilder';
import FormLayout from 'components/Layouts/FormLayout';
import ModalResultAfterSaveChanges from 'components/modals/ModalResultAfterSaveChanges';
import { ENTITIES_ACTION_MAP, ENTITY_ACTION, getActionPath } from 'components/modals/ModalWhereToSaveChanges';
import { isFormTypeCard } from '#web-components/utils';

export default function CreateFormPage() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectCreateFormIsLoading);
  const formData = useSelector(selectForm);
  const hasConflicts = useSelector(selectHasConflicts);
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'createForm' });
  const { versionId } = useVersion();
  const isMaster = isMasterVersion(versionId);
  const formMode = useEntityMode<FormModeCode>();
  const initialData = location.state as FormSchema;

  const methods = useForm({
    mode: 'all',
    shouldUnregister: false,
    defaultValues: {
      formSchema: {
        display: 'form',
        components: initialData?.components || [SUBMIT_BUTTON],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as Omit<FormSchema, 'components'> & { components: any[] },
      title: createFieldCopy(initialData?.title),
      path: '',
      type: {
        value: FormType.form,
        label: FormType.form,
      },
      roles: [],
      showOnCardList: false,
    },
  });
  methods.register('title', isRequiredRules());
  methods.register('path', formPathRules());

  useEffect(() => {
    if (initialData && !initialData.components) {
      dispatch(getFormByNameRequest({ name: initialData.name, versionId }));
    }

    return () => {
      dispatch(getFormByNameClean());
    };
  }, [dispatch, initialData, versionId]);

  useEffect(() => {
    if (formData) {
      methods.setValue('formSchema', {
        display: 'form',
        components: formData?.components || [],
      } as FormSchema);
    }
  }, [formData, methods]);

  const onInvalid = useCallback(() => {
    dispatch(createFormError({
      type: ERROR_TYPE.NOTIFICATION,
      message: i18n.t('errors~form.invalidForm'),
    }));
  }, [dispatch, i18n]);

  const onSubmit = useCallback((data: FormDetails) => {
    const {
      path, title, type, roles, showOnCardList, formSchema, jsonSchemeIsInValid,
    } = data;
    const cardsValue = isFormTypeCard(type.value)
      ? { roles, showOnCardList }
      : { roles: [], showOnCardList: false };

    if (!methods.formState.isValid) {
      return onInvalid();
    }
    if (jsonSchemeIsInValid) {
      return dispatch(createFormError({
        type: ERROR_TYPE.NOTIFICATION,
        message: t('text.formInvalidJson'),
      }));
    }
    return dispatch(createFormRequest({
      versionId,
      data: {
        ...formSchema,
        ...cardsValue,
        path,
        name: path,
        title,
        type: type.value,
      },
    }));
  }, [dispatch, methods.formState.isValid, onInvalid, t, versionId]);

  const handleCancel = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.FORM_LIST, versionId));
  }, [navigate, versionId]);

  const handleResetConflicts = useCallback(() => {
    dispatch(setHasConflicts(null));
  }, [dispatch]);
  const handleCloseConflictsModal = useCallback(() => {
    if (hasConflicts) {
      handleResetConflicts();
      return;
    }
    handleResetConflicts();
    navigate(getRoutePathWithVersion(
      ENTITIES_ACTION_MAP[ENTITY_ACTION.CREATE_FORM][getActionPath(isMaster)]
        .replace(':formId', methods.watch('path') as string),
      versionId,
    ));
  }, [handleResetConflicts, hasConflicts, isMaster, methods, navigate, versionId]);

  return (
    <FormProvider {...methods}>
      <FormLayout
        isLoading={isLoading}
        loaderDescription={i18n.t('text~processingRequest')}
        submitButtonText={t('text.createButton')}
        title={t('title')}
        onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
        onCancel={handleCancel}
        formName={methods.watch('title') || ' '}
      >
        {formMode === FormModeCode.common && <FormFields />}
        {formMode === FormModeCode.modeler && <FormBuilder />}
        {formMode === FormModeCode.preview && <FormPreview />}
        {formMode === FormModeCode.query && <FormPayload />}
        {formMode === FormModeCode.code && <FormCode />}
      </FormLayout>
      <ModalResultAfterSaveChanges
        hasConflicts={hasConflicts}
        onClose={handleCloseConflictsModal}
      />
    </FormProvider>
  );
}
