import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  deleteFormRequest,
  exportFormRequest,
  getFormListClean,
  getFormListRequest,
  selectDeleteFormIsLoading,
  selectFormList,
  selectFormListIsLoading,
  selectHasConflicts,
  setHasConflicts,
} from 'store/form';
import CommonLayout from 'components/Layouts/CommonLayout';
import Table from 'components/Table';
import { ROUTES } from 'constants/routes';
import useVersion from 'hooks/useVersion';
import { getRoutePathWithVersion, isMaster } from 'utils/versions';
import InlineButton from '#web-components/components/InlineButton';
import { dateTimeFormatter } from '#web-components/utils';
import { Order, ColumnDefinition } from '#web-components/types/table';
import Link from '#web-components/components/Link';
import PlusIcon from '#web-components/assets/icons/plus.svg?react';
import SearchInput from '#web-components/components/SearchInput';
import ModalCreateVersion from 'components/modals/ModalCreateVersion';
import ModalWhereToSaveChanges, {
  ENTITIES_ACTION_MAP,
  ENTITY_ACTION,
  getActionPath,
} from 'components/modals/ModalWhereToSaveChanges';
import ModalResultAfterSaveChanges from 'components/modals/ModalResultAfterSaveChanges';
import { CreateVersion } from 'types/versions';
import { Form } from 'types/form';
import { MASTER_VERSION_ID } from 'constants/common';
import styles from './FormListPage.styles';
import FormTableActions from './components/FormTableActions';

const useStyles = makeStyles(styles, { name: 'FormList' });
const MIN_SEARCH_LENGTH = 3;

export default function FormListPage() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'formList' });
  const [order, setOrder] = useState(Order.asc);
  const { versionId, versionCreateIsLoading, createVersion } = useVersion();
  const [orderField, setOrderField] = useState('title');
  const [searchString, setSearchString] = useState('');
  const [isOpenCreateVersion, setIsOpenCreateVersion] = useState(false);
  const [isOpenWhereToSaveChanges, setIsOpenWhereToSaveChanges] = useState(false);
  const [formItem, setFormItem] = useState<Form>();
  const [formAction, setFormAction] = useState<ENTITY_ACTION>(ENTITY_ACTION.CREATE_FORM);
  const [changesDestinationVersionId, setChangesDestinationVersionId] = useState<string>(versionId);
  const dispatch = useDispatch();
  const formList = useSelector(selectFormList);
  const formListIsLoading = useSelector(selectFormListIsLoading);
  const deleteFormIsLoading = useSelector(selectDeleteFormIsLoading);
  const hasConflicts = useSelector(selectHasConflicts);
  const isLoading = formListIsLoading || versionCreateIsLoading || deleteFormIsLoading;
  const isMasterVersion = isMaster(versionId);

  // eslint-disable-next-line no-underscore-dangle
  const formItemList = useMemo(() => {
    return (formList?.map((form) => {
      const updated = form.created === form.updated ? '' : form.updated;

      return ({ ...form, id: form.name, updated });
    }) || [])
      .filter((f) => {
        if (searchString.length < MIN_SEARCH_LENGTH) {
          return true;
        }
        return f.name.toLowerCase().includes(searchString.toLowerCase())
      || f.title.toLowerCase().includes(searchString.toLowerCase());
      });
  }, [formList, searchString]);

  const handleExportClick = useCallback(({ name }) => () => {
    dispatch(exportFormRequest({ name, versionId }));
  }, [dispatch, versionId]);

  const handleCloneClick = useCallback((item) => () => {
    if (isMasterVersion) {
      setIsOpenWhereToSaveChanges(true);
      setFormItem(item);
      setFormAction(ENTITY_ACTION.CREATE_FORM);
      return;
    }
    navigate(getRoutePathWithVersion(ROUTES.CREATE_FORM, versionId), { state: item });
  }, [isMasterVersion, navigate, versionId]);

  const deleteForm = useCallback((item) => {
    const { name, title } = item;
    dispatch(deleteFormRequest({ name, title, versionId }));
  }, [dispatch, versionId]);

  const handleDeleteClick = useCallback((item) => () => {
    if (isMasterVersion) {
      setIsOpenWhereToSaveChanges(true);
      setFormItem(item);
      setFormAction(ENTITY_ACTION.DELETE_FORM);
      return;
    }
    deleteForm(item);
  }, [deleteForm, isMasterVersion]);

  const handleEditClick = useCallback((item) => () => {
    if (isMasterVersion) {
      setIsOpenWhereToSaveChanges(true);
      setFormItem(item);
      setFormAction(ENTITY_ACTION.EDIT_FORM);
      return;
    }

    navigate(getRoutePathWithVersion(ROUTES.EDIT_FORM, versionId).replace(':formId', item.id));
  }, [navigate, isMasterVersion, versionId]);

  const formatter = useCallback((item, property) => {
    return dateTimeFormatter(item, property, i18n.language);
  }, [i18n.language]);

  const columnDefinitions: ColumnDefinition[] = [
    {
      title: t('table.columns.name'),
      property: 'title',
      // TODO: Declare this component outside parent component "FormListPage" or memoize it.
      //  If you want to allow component creation in props, set allowAsProps option to true
      // eslint-disable-next-line react/no-unstable-nested-components
      Component: ({ item }) => {
        const { title, id: formId } = item as { title: string, id: string };
        return (
          <Link
            to={getRoutePathWithVersion(
              isMasterVersion ? ROUTES.READ_ONLY_PREVIEW_FORM : ROUTES.PREVIEW_FORM,
              versionId,
            ).replace(':formId', formId)}
            className={classes.title}
            component={RouterLink}
          >
            {title}
          </Link>
        );
      },
    },
    {
      title: t('table.columns.serviceName'),
      property: 'name',
    },
    {
      title: t('table.columns.created'),
      property: 'created',
      formatter,
    },
    {
      title: t('table.columns.modified'),
      property: 'updated',
      formatter,
    },
    {
      title: '',
      property: '',
      sortable: false,
      // TODO: Declare this component outside parent component "FormListPage" or memoize it.
      //  If you want to allow component creation in props, set allowAsProps option to true
      // eslint-disable-next-line react/no-unstable-nested-components
      Component({ item }) {
        return (
          <FormTableActions
            onExportClick={handleExportClick(item)}
            onDeleteClick={handleDeleteClick(item)}
            onCloneClick={handleCloneClick(item)}
            onEditClick={handleEditClick(item)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getFormListRequest(versionId));
    setOrder(Order.asc);
    setOrderField('title');
    return () => {
      dispatch(getFormListClean());
    };
  }, [dispatch, versionId]);

  const onOrderChange = (orderBy: string, o: Order) => {
    setOrderField(orderBy);
    setOrder(o);
  };

  const acceptChangesToMaster = useCallback(() => {
    setIsOpenWhereToSaveChanges(false);
    setChangesDestinationVersionId(MASTER_VERSION_ID);
    if (formAction === ENTITY_ACTION.DELETE_FORM) {
      deleteForm(formItem);
      return;
    }
    navigate(getRoutePathWithVersion(
      ENTITIES_ACTION_MAP[formAction].path.replace(':formId', formItem?.name as string),
      versionId,
    ), { state: formItem });
  }, [deleteForm, formAction, formItem, navigate, versionId]);

  const handleClick = useCallback(() => {
    if (isMasterVersion) {
      setIsOpenWhereToSaveChanges(true);
      setFormAction(ENTITY_ACTION.CREATE_FORM);
      return;
    }
    acceptChangesToMaster();
  }, [isMasterVersion, acceptChangesToMaster]);

  const handleCreateVersion = useCallback((data: CreateVersion) => {
    setIsOpenCreateVersion(false);
    createVersion({
      data,
      path: ENTITIES_ACTION_MAP[formAction].path.replace(':formId', formItem?.name as string),
      state: formItem,
      ...(formAction === ENTITY_ACTION.DELETE_FORM && {
        nextAction: (id: string) => {
          setChangesDestinationVersionId(id);
          return deleteFormRequest({
            name: formItem?.name as string,
            title: formItem?.title as string,
            versionId: id,
          });
        },
      }),
    });
  }, [createVersion, formAction, formItem]);

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
      ENTITIES_ACTION_MAP[formAction][getActionPath(isMaster(changesDestinationVersionId))]
        .replace(':formId', formItem?.name as string),
      changesDestinationVersionId,
    ));
  }, [changesDestinationVersionId, formAction, formItem?.name, handleResetConflicts, hasConflicts, navigate]);

  return (
    <CommonLayout
      title={t('title')}
      isLoading={isLoading}
      loaderDescription={(deleteFormIsLoading || versionCreateIsLoading) ? i18n.t('text~processingRequest') : ''}
    >
      <Grid container justifyContent="space-between" className={classes.actions}>
        <Grid item>
          <SearchInput
            label={t('fields.searchLabel')}
            placeholder={t('fields.searchPlaceholder')}
            onSearch={setSearchString}
          />
        </Grid>
        <Grid item>
          <InlineButton
            size="medium"
            leftIcon={<PlusIcon />}
            onLinkClick={handleClick}
          >
            {t('table.createForm')}
          </InlineButton>
        </Grid>
      </Grid>
      <Table
        columnDefinitions={columnDefinitions}
        list={formItemList}
        order={order}
        orderField={orderField}
        onOrderChange={onOrderChange}
        emptyPlaceholder={t('table.emptyPlaceholder')}
        hideEmptyPlaceholder={isLoading}
      />
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
        hidden={isLoading}
        hasConflicts={hasConflicts}
        onClose={handleCloseConflictsModal}
        title={i18n.t('components~modal.conflict.title')}
        description={i18n.t(ENTITIES_ACTION_MAP[formAction][isMasterVersion
          ? 'conflictModalDescriptionMaster'
          : 'conflictModalDescriptionCandidate'])}
        textButton={i18n.t(ENTITIES_ACTION_MAP[formAction].conflictModalTextButton)}
      />
    </CommonLayout>
  );
}
