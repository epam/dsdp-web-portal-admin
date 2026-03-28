import React, {
  useCallback, useEffect, Suspense, useState,
} from 'react';

import { ROUTES } from 'constants/routes';
import useEntityMode from 'hooks/useEntityMode';
import useVersion from 'hooks/useVersion';
import Loader from 'components/Loader';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';
import { makeStyles, MenuItem, MenuList } from '@material-ui/core';
import clsx from 'clsx';

import {
  getProcessByNameRequest,
  getProcessByNameClean,
  selectProcess,
  updateProcessRequest,
  updateProcessError,
  selectEditProcessIsLoading,
  deleteProcessRequest,
  selectProcessHasConflicts,
  setProcessHasConflicts,
  selectDeleteProcessIsLoading,
} from 'store/process';
import { X_PATH } from 'constants/xPath';
import { bpTitleRules, bpNameRules } from 'constants/validationRules';
import { ProcessFormData, ProcessModeCode } from 'types/processes';
import { getProcessObj, setProcessAttributes } from 'utils/process';
import { getRoutePathWithVersion, isMaster as isMasterVersion } from 'utils/versions';
import ProcessLayout from 'components/Layouts/ProcessLayout';
import ProcessFields from 'components/ProcessManagement/ProcessFields';
import ProcessModeler from 'components/ProcessManagement/ProcessModeler';
import ProcessCode from 'components/ProcessManagement/ProcessCode';

import PopperButton from '#web-components/components/PopperButton';
import { ButtonType } from '#web-components/types/popper';
import MenuIcon from '#web-components/assets/icons/menu.svg?react';
import { ERROR_TYPE } from '#shared/types/common';

import ModalWhereToSaveChanges from 'components/modals/ModalWhereToSaveChanges/ModalWhereToSaveChanges';
import { ENTITIES_ACTION_MAP, ENTITY_ACTION, getActionPath } from 'components/modals/ModalWhereToSaveChanges';
import ModalCreateVersion from 'components/modals/ModalCreateVersion/ModalCreateVersion';
import ModalResultAfterSaveChanges from 'components/modals/ModalResultAfterSaveChanges/ModalResultAfterSaveChanges';
import { CreateVersion } from 'types/versions';
import { MASTER_VERSION_ID } from 'constants/common';
import { selectBpModelerTemplatesIsLoading } from 'store/config';
import styles from './EditProcessPage.styles';

const useStyles = makeStyles(styles, { name: 'EditProcessPage' });

export default function EditProcessPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { versionId, createVersion, versionCreateIsLoading } = useVersion();
  const processMode = useEntityMode<ProcessModeCode>();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'editProcess' });
  const params = useParams<{ processName: string }>();
  const location = useLocation();
  const isMaster = isMasterVersion(versionId);
  const processString = useSelector(selectProcess);
  const editProcessIsLoading = useSelector(selectEditProcessIsLoading);
  const deleteProcessIsLoading = useSelector(selectDeleteProcessIsLoading);
  const bpModelerTemplatesIsLoading = useSelector(selectBpModelerTemplatesIsLoading);
  const hasConflicts = useSelector(selectProcessHasConflicts);
  const [isOpenCreateVersion, setIsOpenCreateVersion] = useState(false);
  const [isOpenWhereToSaveChanges, setIsOpenWhereToSaveChanges] = useState(false);
  const [processAction, setProcessAction] = useState<ENTITY_ACTION>(ENTITY_ACTION.EDIT_PROCESS);
  const [changesDestinationVersionId, setChangesDestinationVersionId] = useState<string>(versionId);

  const isReadOnlyMode = location.pathname.includes('preview');
  const isLoading = editProcessIsLoading
  || versionCreateIsLoading || deleteProcessIsLoading || bpModelerTemplatesIsLoading;
  const handleCancel = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.PROCESS_LIST, versionId));
  }, [navigate, versionId]);
  const methods = useForm<ProcessFormData>({
    mode: 'all',
    shouldUnregister: false,
    defaultValues: {
      name: '',
      title: '',
      formProcessString: '',
      isXmlValid: true,
    },
  });
  const {
    setValue, handleSubmit, register, watch, getValues, formState: { isValid: formStateIsValid, isDirty },
  } = methods;

  const handleChange = ({ target: { name, value } }: { target: { name: 'title' | 'name', value: string } }) => {
    const oldString = getValues('formProcessString');
    const inputPropertyMap = {
      name: 'id',
      title: 'name',
    };
    setProcessAttributes(oldString, inputPropertyMap[name], value)
      .then((updatedXmlString) => {
        setValue('formProcessString', updatedXmlString);
      });
  };

  const handleCloneClick = useCallback(async () => {
    if (processString) {
      const { id, name } = await getProcessObj(processString);
      if (isMaster) {
        setProcessAction(ENTITY_ACTION.CREATE_PROCESS);
        setChangesDestinationVersionId(MASTER_VERSION_ID);
      }
      navigate(getRoutePathWithVersion(ROUTES.CREATE_PROCESS, versionId), {
        state: {
          processItem: { title: name, name: id, formProcessString: processString },
        },
      });
    }
  }, [isMaster, navigate, processString, versionId]);

  const handleDeleteClick = useCallback(async () => {
    if (processString) {
      const { name, id } = await getProcessObj(processString);
      setProcessAction(ENTITY_ACTION.DELETE_PROCESS);
      if (isMaster) {
        setChangesDestinationVersionId(MASTER_VERSION_ID);
      }
      dispatch(deleteProcessRequest(
        { title: name, name: id, versionId },
      ));
    }
  }, [dispatch, isMaster, processString, versionId]);

  const showNotification = useCallback((message: string) => {
    dispatch(updateProcessError({
      type: ERROR_TYPE.NOTIFICATION,
      message,
    }));
  }, [dispatch]);
  const onInvalid = useCallback(() => {
    showNotification(i18n.t('errors~form.invalidForm'));
  }, [showNotification, i18n]);

  const isNameChanged = useCallback(() => {
    return params.processName !== getValues('name');
  }, [getValues, params.processName]);

  const onSubmit = useCallback(({ formProcessString, name, title }: ProcessFormData) => {
    if (isNameChanged()) {
      return showNotification(t('text.nameChangedError'));
    }
    const isFormFieldsValid = isDirty ? formStateIsValid : true;

    if (isFormFieldsValid && getValues('isXmlValid')) {
      return dispatch(updateProcessRequest({
        versionId, data: formProcessString, name, title,
      }));
    }
    return onInvalid();
  }, [dispatch, getValues, isNameChanged, isDirty, formStateIsValid, onInvalid, showNotification, t, versionId]);

  const handleEditMode = useCallback(() => {
    setIsOpenWhereToSaveChanges(true);
    setProcessAction(ENTITY_ACTION.EDIT_PROCESS);
  }, []);
  const handleResetConflicts = useCallback(() => {
    dispatch(setProcessHasConflicts(null));
  }, [dispatch]);
  const moveToActionProcessPage = useCallback(async () => {
    if (processString) {
      const { id: processName, name: title } = await getProcessObj(processString);
      setIsOpenWhereToSaveChanges(false);
      setChangesDestinationVersionId(MASTER_VERSION_ID);
      if (processAction === ENTITY_ACTION.DELETE_PROCESS) {
        dispatch(deleteProcessRequest({ title, name: processName, versionId }));
        return;
      }
      navigate(getRoutePathWithVersion(
        ENTITIES_ACTION_MAP[processAction].path.replace(':processName', processName as string),
        versionId,
      ), { state: { title, name: processName, formProcessString: processString } });
    }
  }, [dispatch, navigate, processAction, processString, versionId]);
  const handleCreateVersion = useCallback(async (data: CreateVersion) => {
    if (processString) {
      const { id: name, name: title } = await getProcessObj(processString);
      createVersion({
        data,
        path: ENTITIES_ACTION_MAP[processAction].path.replace(':processName', name),
        state: { title, name, formProcessString: processString },
        ...(processAction === ENTITY_ACTION.DELETE_PROCESS && {
          nextAction: (id: string) => {
            setChangesDestinationVersionId(id);
            return deleteProcessRequest({
              name,
              title,
              versionId: id,
            });
          },
        }),
      });
      setIsOpenCreateVersion(false);
    }
  }, [createVersion, processAction, processString]);
  const handleCloseConflictsModal = useCallback(async () => {
    if (processString) {
      const { id: name } = await getProcessObj(processString);
      if (hasConflicts) {
        handleResetConflicts();
        return;
      }
      handleResetConflicts();
      navigate(getRoutePathWithVersion(ENTITIES_ACTION_MAP[processAction][getActionPath(
        isMasterVersion(changesDestinationVersionId),
      )]
        .replace(':processName', name), changesDestinationVersionId));
    }
  }, [changesDestinationVersionId, handleResetConflicts, hasConflicts, navigate, processAction, processString]);

  register('name', { ...bpNameRules(), onChange: handleChange });
  register('title', { ...bpTitleRules(), onChange: handleChange });

  useEffect(() => {
    (async () => {
      if (processString) {
        const { id, name } = await getProcessObj(processString);
        setValue('name', id);
        setValue('title', name);
        setValue('formProcessString', processString);
      }
    })();
  }, [processString, setValue]);
  useEffect(() => {
    const name = params.processName;
    dispatch(getProcessByNameRequest({ name, versionId }));

    return () => {
      dispatch(getProcessByNameClean());
    };
  }, [dispatch, params.processName, versionId]);

  return (
    <FormProvider {...methods}>
      <ProcessLayout
        isLoading={isLoading}
        processName={watch('title')}
        onCancel={handleCancel}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        onEditMode={handleEditMode}
        submitButtonText={t('text.createButton')}
        title={isMaster ? t('text.readOnlyPageTitle') : t('title')}
        isReadOnly={isReadOnlyMode}
        loaderDescription={i18n.t('text~processingRequest')}
        {...(!isReadOnlyMode && {
          menu: (
            <PopperButton
              buttonType={ButtonType.icon}
              buttonProps={{
                children: <MenuIcon data-xpath={X_PATH.menuButton} />,
              }}
              placement="bottom-start"
            >
              <MenuList className={classes.menuList}>
                <MenuItem
                  onClick={handleCloneClick}
                  className={classes.menuItem}
                >
                  {t('actions.clone')}
                </MenuItem>
                <MenuItem
                  onClick={handleDeleteClick}
                  className={clsx(classes.menuItem, classes.menuItemDelete)}
                >
                  {t('actions.delete')}
                </MenuItem>
              </MenuList>
            </PopperButton>
          ),
        })}
      >
        {processMode === ProcessModeCode.common && <ProcessFields isEditPage isReadOnly={isReadOnlyMode} />}

        {(processMode === ProcessModeCode.modeler) && (
          <Suspense fallback={<Loader />}>
            <ProcessModeler isReadonly={isReadOnlyMode} />
          </Suspense>
        )}
        {processMode === ProcessModeCode.code && <ProcessCode isReadOnly={isReadOnlyMode} />}
      </ProcessLayout>
      <ModalWhereToSaveChanges
        isOpen={isOpenWhereToSaveChanges}
        onOpenChange={setIsOpenWhereToSaveChanges}
        onOpenCreateVersion={setIsOpenCreateVersion}
        onChangesToMaster={moveToActionProcessPage}
        description={i18n.t(ENTITIES_ACTION_MAP[processAction].description)}
      />
      <ModalCreateVersion
        isOpen={isOpenCreateVersion}
        onOpenChange={setIsOpenCreateVersion}
        onModalSubmit={handleCreateVersion}
      />
      <ModalResultAfterSaveChanges
        hasConflicts={hasConflicts}
        onClose={handleCloseConflictsModal}
        title={i18n.t('components~modal.conflict.title')}
        description={i18n.t(ENTITIES_ACTION_MAP[processAction][isMaster
          ? 'conflictModalDescriptionMaster'
          : 'conflictModalDescriptionCandidate'])}
        textButton={i18n.t(ENTITIES_ACTION_MAP[processAction].conflictModalTextButton)}
      />
    </FormProvider>
  );
}
