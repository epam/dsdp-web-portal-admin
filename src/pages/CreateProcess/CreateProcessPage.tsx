import React, {
  useCallback, useEffect, Suspense,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import ProcessLayout from 'components/Layouts/ProcessLayout';
import useEntityMode from 'hooks/useEntityMode';
import useVersion from 'hooks/useVersion';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createProcessRequest, getProcessByNameClean,
  getProcessByNameRequest, selectCreateProcessIsLoading,
  selectProcessHasConflicts, selectProcess,
} from 'store/process';
import { ProcessFormData, ProcessListItem, ProcessModeCode } from 'types/processes';
import { getRoutePathWithVersion, isMaster as isMasterVersion } from 'utils/versions';
import { ROUTES } from 'constants/routes';
import Loader from 'components/Loader';
import ProcessFields from 'components/ProcessManagement/ProcessFields';
import { createProcessString, getProcessObj, setProcessAttributes } from 'utils/process';
import { createFieldCopy } from 'utils';
import { createProcessError, setProcessHasConflicts } from 'store/process/slice';
import { ERROR_TYPE } from '#shared/types/common';
import { bpTitleRules, bpNameRules } from 'constants/validationRules';
import ProcessModeler from 'components/ProcessManagement/ProcessModeler';
import ProcessCode from 'components/ProcessManagement/ProcessCode';
import ModalResultAfterSaveChanges from 'components/modals/ModalResultAfterSaveChanges/ModalResultAfterSaveChanges';
import { ENTITIES_ACTION_MAP, ENTITY_ACTION, getActionPath } from 'components/modals/ModalWhereToSaveChanges';
import { get } from 'lodash/fp';

const DEFAULT_PROCESS_NAME = 'new-bp';

export default function CreateProcessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = get('state.processItem', location) as (ProcessListItem | ProcessFormData | null);
  const methods = useForm<ProcessFormData>({
    mode: 'all',
    shouldUnregister: false,
    reValidateMode: 'onChange',
    defaultValues: {
      name: DEFAULT_PROCESS_NAME,
      title: createFieldCopy(initialData?.title),
      formProcessString: undefined,
      isXmlValid: true,
    },
  });
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'createProcess' });
  const { versionId } = useVersion();
  const isMaster = isMasterVersion(versionId);
  const processMode = useEntityMode<ProcessModeCode>();
  const dataProcessString = useSelector(selectProcess);
  const isLoading = useSelector(selectCreateProcessIsLoading);
  const hasConflicts = useSelector(selectProcessHasConflicts);
  const dispatch = useDispatch();
  const {
    watch, handleSubmit, getValues, setValue, register, formState,
  } = methods;
  const processString = watch('formProcessString');

  const handleCancel = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.PROCESS_LIST, versionId));
  }, [navigate, versionId]);

  const onInvalid = useCallback(() => {
    dispatch(createProcessError({
      type: ERROR_TYPE.NOTIFICATION,
      message: i18n.t('errors~form.invalidForm'),
    }));
  }, [dispatch, i18n]);

  const onSubmit = useCallback(({ formProcessString, title, name }: ProcessFormData) => {
    if (methods.formState.isValid && getValues('isXmlValid')) {
      dispatch(createProcessRequest({
        versionId, data: formProcessString, title, name,
      }));
    } else {
      onInvalid();
    }
  }, [dispatch, getValues, methods.formState.isValid, onInvalid, versionId]);

  const handleChange = ({ target: { name, value } }: { target: { name: 'title' | 'name', value: string } }) => {
    const inputPropertyMap = {
      name: 'id',
      title: 'name',
    };
    const oldString = getValues('formProcessString');
    setProcessAttributes(oldString, inputPropertyMap[name], value)
      .then((updatedXmlString) => {
        setValue('formProcessString', updatedXmlString);
      });
  };
  const handleResetConflicts = useCallback(() => {
    dispatch(setProcessHasConflicts(null));
  }, [dispatch]);
  const handleCloseConflictsModal = useCallback(async () => {
    if (hasConflicts) {
      handleResetConflicts();
      return;
    }
    handleResetConflicts();
    const { id: name } = await getProcessObj(processString);
    navigate(getRoutePathWithVersion(ENTITIES_ACTION_MAP[ENTITY_ACTION.CREATE_PROCESS][getActionPath(isMaster)]
      .replace(':processName', name), versionId));
  }, [handleResetConflicts, hasConflicts, isMaster, navigate, processString, versionId]);

  register('name', { ...bpNameRules(), onChange: handleChange });
  register('title', { ...bpTitleRules(), onChange: handleChange });
  const { dirtyFields: { formProcessString: formProcessStringDirty } } = formState;

  useEffect(() => {
    (async () => {
      if (!processString && !formProcessStringDirty) {
        createProcessString('', DEFAULT_PROCESS_NAME)
          .then(async (newString: string) => {
            setValue('formProcessString', newString);
          });
      }
    })();
  }, [formProcessStringDirty, processString, setValue]);

  useEffect(() => {
    if (initialData && !(initialData as ProcessFormData).formProcessString) {
      dispatch(getProcessByNameRequest({ name: initialData.name, versionId }));
    }
    return () => {
      dispatch(getProcessByNameClean());
    };
  }, [dispatch, initialData, versionId]);

  useEffect(() => {
    if (dataProcessString) {
      if (initialData?.name) {
        setProcessAttributes(dataProcessString, 'name', createFieldCopy(initialData?.title))
          .then((str) => setProcessAttributes(str, 'id', DEFAULT_PROCESS_NAME))
          .then((updatedXmlString) => {
            setValue('formProcessString', updatedXmlString);
          });
      } else {
        setValue('formProcessString', dataProcessString);
      }
    }
  }, [dataProcessString, setValue, initialData]);

  return (
    <FormProvider {...methods}>
      <ProcessLayout
        isLoading={isLoading}
        processName={watch('title')}
        onCancel={handleCancel}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        submitButtonText={t('text.createButton')}
        title={t('title')}
        loaderDescription={i18n.t('text~processingRequest')}
      >
        {processMode === ProcessModeCode.common && <ProcessFields />}

        {(processMode === ProcessModeCode.modeler) && (
          <Suspense fallback={<Loader />}>
            <ProcessModeler />
          </Suspense>
        )}
        {processMode === ProcessModeCode.code && <ProcessCode />}
      </ProcessLayout>
      <ModalResultAfterSaveChanges
        hasConflicts={hasConflicts}
        onClose={handleCloseConflictsModal}
      />
    </FormProvider>
  );
}
