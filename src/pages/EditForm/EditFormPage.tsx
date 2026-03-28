import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { useParams, useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { makeStyles, MenuItem, MenuList } from '@material-ui/core';
import zIndex from '@material-ui/core/styles/zIndex';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import FormBuilder from 'components/FormManagement/FormBuilder';
import FormFields from 'components/FormManagement/FormFields';
import { Form as FormSchema, FormDetails, FormModeCode } from 'types/form';
import { ROUTES } from 'constants/routes';
import FormPreview from 'components/FormManagement/FormPreview';
import FormCode from 'components/FormManagement/FormCode';
import {
  updateFormRequest,
  getFormByNameRequest,
  selectForm,
  selectUpdateFormIsLoading,
  exportFormRequest,
  deleteFormRequest,
  getFormByNameClean,
  updateFormError,
  selectHasConflicts,
  setHasConflicts,
  selectGetFormByNameIsLoading,
  selectDeleteFormIsLoading,
  selectExportFormIsLoading,
} from 'store/form';
import { X_PATH } from 'constants/xPath';
import useVersion from 'hooks/useVersion';
import { getRoutePathWithVersion, isMaster as isMasterVersion } from 'utils/versions';
import useEntityMode from 'hooks/useEntityMode';
import FormPayload from 'components/FormManagement/FormPayload';
import { ERROR_TYPE } from '#shared/types/common';
import { isRequiredRules, formPathRules } from 'constants/validationRules';
import FormLayout from 'components/Layouts/FormLayout';
import Typography from '#web-components/components/Typography';
import Divider from '#web-components/components/Divider';
import { ButtonType } from '#web-components/types/popper';
import { FormType } from '#web-components/components/Form/types';
import PopperButton from '#web-components/components/PopperButton';
import MenuIcon from '#web-components/assets/icons/menu.svg?react';
import ModalWhereToSaveChanges, {
  ENTITIES_ACTION_MAP,
  ENTITY_ACTION,
  getActionPath,
} from 'components/modals/ModalWhereToSaveChanges';
import ModalCreateVersion from 'components/modals/ModalCreateVersion';
import ModalResultAfterSaveChanges from 'components/modals/ModalResultAfterSaveChanges';
import { CreateVersion } from 'types/versions';
import { MASTER_VERSION_ID } from 'constants/common';
import { isFormTypeCard } from '#web-components/utils';
import styles from './EditFormPage.styles';

interface Params {
  formId: string
}

const useStyles = makeStyles(styles, { name: 'EditForm' });

export default function EditFormPage() {
  const navigate = useNavigate();
  const [isOpenWhereToSaveChanges, setIsOpenWhereToSaveChanges] = useState(false);
  const [isOpenCreateVersion, setIsOpenCreateVersion] = useState(false);
  const [formAction, setFormAction] = useState<ENTITY_ACTION>(ENTITY_ACTION.EDIT_FORM);
  const { versionId, createVersion, versionCreateIsLoading } = useVersion();
  const [changesDestinationVersionId, setChangesDestinationVersionId] = useState<string>(versionId);
  const params = useParams<Params>();
  const locations = useLocation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const updateFormIsLoading = useSelector(selectUpdateFormIsLoading);
  const getFormByNameIsLoading = useSelector(selectGetFormByNameIsLoading);
  const deleteFormIsLoading = useSelector(selectDeleteFormIsLoading);
  const exportFormIsLoading = useSelector(selectExportFormIsLoading);
  const formData = useSelector(selectForm);
  const hasConflicts = useSelector(selectHasConflicts);
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'editForm' });
  const formMode = useEntityMode<FormModeCode>();
  const isMaster = isMasterVersion(versionId);
  const isLoading = getFormByNameIsLoading || updateFormIsLoading || versionCreateIsLoading || deleteFormIsLoading
    || exportFormIsLoading;
  const isReadOnlyMode = locations.pathname.includes('preview');

  const methods = useForm({
    mode: 'all',
    shouldUnregister: false,
    defaultValues: {
      formSchema: {
        display: 'form',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as Omit<FormSchema, 'components'> & { components: any[] },
      title: '',
      path: '',
      type: {
        value: FormType.form,
        label: FormType.form,
      },
      roles: [''],
      showOnCardList: false,
    },
  });
  methods.register('title', isRequiredRules());
  methods.register('path', formPathRules());

  const {
    setValue, getValues, handleSubmit, control, formState: { isValid: formStateIsValid, isDirty },
  } = methods;
  useWatch({ control, name: 'title' });
  useWatch({ control, name: 'path' });

  useEffect(() => {
    const name = params.formId;
    dispatch(getFormByNameRequest({ name, versionId }));

    return () => {
      dispatch(getFormByNameClean());
    };
  }, [dispatch, params.formId, versionId]);

  useEffect(() => {
    if (formData) {
      const {
        title, path, type = FormType.form, roles = [''], showOnCardList = false,
      } = formData;
      setValue('title', title);
      setValue('path', path);
      setValue('type', { value: type, label: type });
      setValue('roles', roles);
      setValue('showOnCardList', showOnCardList);
      setValue('formSchema', formData);
    }
  }, [setValue, formData]);

  const onInvalid = useCallback(() => {
    dispatch(updateFormError({
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

    const isFormFieldsValid = isDirty ? formStateIsValid : true;

    if (!isFormFieldsValid) {
      return onInvalid();
    }
    if (jsonSchemeIsInValid) {
      return dispatch(updateFormError({
        type: ERROR_TYPE.NOTIFICATION,
        message: t('text.formInvalidJson'),
      }));
    }
    return dispatch(updateFormRequest({
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
  }, [dispatch, formStateIsValid, isDirty, onInvalid, t, versionId]);

  const handleCancel = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.FORM_LIST, versionId));
  }, [navigate, versionId]);

  const handleExportClick = useCallback(() => {
    const { formId: formName } = params;
    dispatch(exportFormRequest({ name: formName, versionId }));
  }, [dispatch, params, versionId]);

  const handleCloneClick = useCallback(() => {
    if (formData) {
      if (isMaster) {
        setFormAction(ENTITY_ACTION.CREATE_FORM);
        setChangesDestinationVersionId(MASTER_VERSION_ID);
      }
      navigate(getRoutePathWithVersion(ROUTES.CREATE_FORM, versionId), { state: formData });
    }
  }, [formData, isMaster, navigate, versionId]);

  const handleDeleteClick = useCallback(() => {
    const { formId: formName } = params;
    setFormAction(ENTITY_ACTION.DELETE_FORM);
    if (formData) {
      setFormAction(ENTITY_ACTION.DELETE_FORM);
      if (isMaster) {
        setChangesDestinationVersionId(MASTER_VERSION_ID);
      }
      dispatch(deleteFormRequest({ name: formName, title: formData.title, versionId }));
    }
  }, [dispatch, formData, isMaster, params, versionId]);

  const acceptChangesToMaster = useCallback(() => {
    setIsOpenWhereToSaveChanges(false);
    setChangesDestinationVersionId(MASTER_VERSION_ID);
    if (formAction === ENTITY_ACTION.DELETE_FORM) {
      dispatch(deleteFormRequest({ name: formData?.name as string, title: formData?.title as string, versionId }));
      return;
    }
    navigate(getRoutePathWithVersion(
      ENTITIES_ACTION_MAP[formAction].path.replace(':formId', formData?.name as string),
      versionId,
    ), { state: formData });
  }, [dispatch, formAction, formData, navigate, versionId]);

  const handleCreateVersion = useCallback((data: CreateVersion) => {
    createVersion({
      data,
      path: ENTITIES_ACTION_MAP[formAction].path.replace(':formId', formData?.name as string),
      state: formData as FormSchema,
      ...(formAction === ENTITY_ACTION.DELETE_FORM && {
        nextAction: (id: string) => {
          setChangesDestinationVersionId(id);
          return deleteFormRequest({
            name: formData?.name as string,
            title: formData?.title as string,
            versionId: id,
          });
        },
      }),
    });
    setIsOpenCreateVersion(false);
  }, [createVersion, formAction, formData]);

  const handleResetConflicts = useCallback(() => {
    dispatch(setHasConflicts(null));
  }, [dispatch]);

  const handleEditMode = useCallback(() => {
    setIsOpenWhereToSaveChanges(true);
    setFormAction(ENTITY_ACTION.EDIT_FORM);
  }, []);
  const handleCloseConflictsModal = useCallback(() => {
    if (hasConflicts) {
      handleResetConflicts();
      return;
    }
    handleResetConflicts();
    navigate(getRoutePathWithVersion(
      ENTITIES_ACTION_MAP[formAction][getActionPath(isMasterVersion(changesDestinationVersionId))]
        .replace(':formId', formData?.name as string),
      changesDestinationVersionId,
    ));
  }, [changesDestinationVersionId, formAction, formData?.name, handleResetConflicts, hasConflicts, navigate]);

  return (
    <FormProvider {...methods}>
      <FormLayout
        isLoading={isLoading}
        loaderDescription={(updateFormIsLoading || deleteFormIsLoading) ? i18n.t('text~processingRequest') : ''}
        submitButtonText={t('text.createButton')}
        onEditMode={handleEditMode}
        title={isMaster ? t('text.readOnlyPageTitle') : t('title')}
        formName={getValues('title') || ' '}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        onCancel={handleCancel}
        isReadOnly={isReadOnlyMode}
        menu={(
          <PopperButton
            buttonType={ButtonType.icon}
            buttonProps={{
              children: <MenuIcon data-xpath={X_PATH.formDeleteButton} />,
            }}
            zIndex={zIndex.modal - 1}
            placement="bottom-start"
          >
            <MenuList className={classes.menuList}>
              <div className={clsx(classes.menuItem, classes.menuTitle)}>
                <Typography variant="textTiny">
                  {t('text.title')}
                </Typography>
              </div>
              {!isReadOnlyMode && (
                <MenuItem
                  onClick={handleCloneClick}
                  className={classes.menuItem}
                >
                  {t('actions.clone')}
                </MenuItem>
              )}
              <MenuItem
                onClick={handleExportClick}
                className={classes.menuItem}
              >
                {t('actions.export')}
              </MenuItem>
              {!isReadOnlyMode && (
                <div>
                  <div className={clsx(classes.menuItem, classes.menuDivider)}>
                    <Divider />
                  </div>
                  <MenuItem
                    onClick={handleDeleteClick}
                    className={clsx(classes.menuItemDelete, classes.menuItem)}
                  >
                    {t('actions.delete')}
                  </MenuItem>
                </div>
              )}
            </MenuList>
          </PopperButton>
        )}
      >
        {formMode === FormModeCode.common && <FormFields isReadOnly={isReadOnlyMode} isEditPage />}
        {formMode === FormModeCode.modeler && !isReadOnlyMode && <FormBuilder />}
        {formMode === FormModeCode.preview && <FormPreview />}
        {formMode === FormModeCode.query && <FormPayload />}
        {formMode === FormModeCode.code && <FormCode isReadOnly={isReadOnlyMode} />}
      </FormLayout>
      <ModalWhereToSaveChanges
        isOpen={isOpenWhereToSaveChanges}
        onOpenChange={setIsOpenWhereToSaveChanges}
        onOpenCreateVersion={setIsOpenCreateVersion}
        onChangesToMaster={acceptChangesToMaster}
        description={i18n.t(ENTITIES_ACTION_MAP[formAction].description)}
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
        description={i18n.t(ENTITIES_ACTION_MAP[formAction][isMaster
          ? 'conflictModalDescriptionMaster'
          : 'conflictModalDescriptionCandidate'])}
        textButton={i18n.t(ENTITIES_ACTION_MAP[formAction].conflictModalTextButton)}
      />
    </FormProvider>
  );
}
