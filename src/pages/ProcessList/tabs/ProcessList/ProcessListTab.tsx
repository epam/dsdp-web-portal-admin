import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { Link as RouterLink, useNavigate } from 'react-router';
import { Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'components/Table';
import { ROUTES } from 'constants/routes';
import useVersion from 'hooks/useVersion';

import { getRoutePathWithVersion, isMaster } from 'utils/versions';
import {
  deleteProcessRequest,
  getProcessListClean,
  getProcessListRequest,
  selectProcessHasConflicts,
  selectProcessList,
  selectProcessListIsLoading,
  setProcessHasConflicts,
} from 'store/process';
import { ProcessListItem } from 'types/processes';
import InlineButton from '#web-components/components/InlineButton';
import { dateTimeFormatter } from '#web-components/utils';
import { Order, ColumnDefinition, ListItem } from '#web-components/types/table';
import Link from '#web-components/components/Link';
import SearchInput from '#web-components/components/SearchInput';
import PlusIcon from '#web-components/assets/icons/plus.svg?react';

import ModalWhereToSaveChanges, {
  ENTITIES_ACTION_MAP,
  ENTITY_ACTION,
  getActionPath,
} from 'components/modals/ModalWhereToSaveChanges';
import ModalCreateVersion from 'components/modals/ModalCreateVersion';
import { CreateVersion } from 'types/versions';
import ModalResultAfterSaveChanges from 'components/modals/ModalResultAfterSaveChanges/ModalResultAfterSaveChanges';
import { MASTER_VERSION_ID } from 'constants/common';
import styles from './ProcessListTab.styles';
import ProcessTableActions from '../../components/ProcessTableActions';

const useStyles = makeStyles(styles, { name: 'ProcessListTab' });
const MIN_SEARCH_LENGTH = 3;

export default function ProcessListTab() {
  const classes = useStyles();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'processList' });
  const { versionId, createVersion } = useVersion();

  const [order, setOrder] = useState(Order.asc);
  const [orderField, setOrderField] = useState('title');
  const [searchString, setSearchString] = useState('');
  const [isOpenCreateVersion, setIsOpenCreateVersion] = useState(false);
  const [isOpenWhereToSaveChanges, setIsOpenWhereToSaveChanges] = useState(false);
  const [processItem, setProcessItem] = useState<ProcessListItem>();
  const [processAction, setProcessAction] = useState<ENTITY_ACTION>(ENTITY_ACTION.CREATE_PROCESS);
  const [changesDestinationVersionId, setChangesDestinationVersionId] = useState<string>(versionId);

  const dispatch = useDispatch();
  const processList = useSelector(selectProcessList);
  const processItemList = useMemo(() => {
    return (processList?.map((process) => ({ ...process, id: process.name })) || [])
      .filter((p) => {
        if (searchString.length < MIN_SEARCH_LENGTH) {
          return true;
        }
        return p.name.toLowerCase().includes(searchString.toLowerCase())
      || p.title.toLowerCase().includes(searchString.toLowerCase());
      });
  }, [processList, searchString]);
  const isLoading = useSelector(selectProcessListIsLoading);
  const hasConflicts = useSelector(selectProcessHasConflicts);
  const isMasterList = isMaster(versionId);

  const moveToActionProcessPage = useCallback(() => {
    setIsOpenWhereToSaveChanges(false);
    setChangesDestinationVersionId(MASTER_VERSION_ID);
    if (processAction === ENTITY_ACTION.DELETE_PROCESS && processItem) {
      const { name, title } = processItem;
      dispatch(deleteProcessRequest({ name, title, versionId }));
      return;
    }
    navigate(getRoutePathWithVersion(
      ENTITIES_ACTION_MAP[processAction].path.replace(':processName', processItem?.name as string),
      versionId,
    ), { state: processItem ? { processItem } : null });
  }, [dispatch, navigate, processAction, processItem, versionId]);

  const handleEditClick = useCallback((item) => () => {
    if (isMasterList) {
      setIsOpenWhereToSaveChanges(true);
      setProcessItem(item);
      setProcessAction(ENTITY_ACTION.EDIT_PROCESS);
      return;
    }
    navigate(getRoutePathWithVersion(ROUTES.EDIT_PROCESS, versionId).replace(':processName', item.id));
  }, [navigate, isMasterList, versionId]);

  const handleCloneClick = useCallback((item: ProcessListItem) => () => {
    if (isMasterList) {
      setIsOpenWhereToSaveChanges(true);
      setProcessItem(item);
      return;
    }
    navigate(getRoutePathWithVersion(ROUTES.CREATE_PROCESS, versionId), { state: { processItem: item } });
  }, [navigate, isMasterList, versionId]);

  const handleDeleteClick = useCallback((item: ProcessListItem) => () => {
    if (isMasterList) {
      setIsOpenWhereToSaveChanges(true);
      setProcessItem(item);
      setProcessAction(ENTITY_ACTION.DELETE_PROCESS);
      return;
    }
    const { name, title } = item;
    dispatch(deleteProcessRequest({ name, title, versionId }));
  }, [dispatch, isMasterList, versionId]);

  const handleResetConflicts = useCallback(() => {
    dispatch(setProcessHasConflicts(null));
  }, [dispatch]);

  const formatter = useCallback((item: ListItem, property: string) => {
    return dateTimeFormatter(item, property, i18n.language);
  }, [i18n.language]);

  const columnDefinitions: ColumnDefinition[] = [
    {
      title: t('table.columns.name'),
      property: 'title',
      // TODO: Declare this component outside parent component "ProcessListPage" or memoize it.
      //  If you want to allow component creation in props, set allowAsProps option to true
      // eslint-disable-next-line react/no-unstable-nested-components
      Component: ({ item }) => {
        const { title, name } = item as ProcessListItem;
        return (
          <Link
            to={getRoutePathWithVersion(
              isMasterList ? ROUTES.READ_ONLY_PROCESS : ROUTES.EDIT_PROCESS.replace(':processName', name),
              versionId,
            ).replace(':processName', name)}
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
      // eslint-disable-next-line react/no-unstable-nested-components
      Component({ item }) {
        const created = dateTimeFormatter(item, 'created', i18n.language);
        const modified = dateTimeFormatter(item, 'updated', i18n.language);

        if (modified === created) {
          // eslint-disable-next-line react/jsx-no-useless-fragment
          return <></>;
        }
        return <span>{modified}</span>;
      },
    },
    {
      title: '',
      property: '',
      sortable: false,
      // TODO: Declare this component outside parent component "ProcessListPage" or memoize it.
      //  If you want to allow component creation in props, set allowAsProps option to true
      // eslint-disable-next-line react/no-unstable-nested-components
      Component({ item }) {
        return (
          <ProcessTableActions
            onDeleteClick={handleDeleteClick(item as ProcessListItem)}
            onCloneClick={handleCloneClick(item as ProcessListItem)}
            onEditClick={handleEditClick(item as ProcessListItem)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(getProcessListRequest(versionId));
    setOrder(Order.asc);
    setOrderField('title');
    return () => {
      dispatch(getProcessListClean());
    };
  }, [dispatch, versionId]);

  const onOrderChange = (orderBy: string, o: Order) => {
    setOrderField(orderBy);
    setOrder(o);
  };
  const handleCreateClick = useCallback(() => {
    if (isMasterList) {
      setProcessAction(ENTITY_ACTION.CREATE_PROCESS);
      setIsOpenWhereToSaveChanges(true);
    } else {
      moveToActionProcessPage();
    }
  }, [isMasterList, moveToActionProcessPage]);

  const handleCreateVersionWithProcess = useCallback((data: CreateVersion) => {
    createVersion({
      data,
      path: ENTITIES_ACTION_MAP[processAction].path.replace(':processName', String(processItem?.name)),
      state: { processItem },
      ...(processAction === ENTITY_ACTION.DELETE_PROCESS && {
        nextAction: (id: string) => {
          setChangesDestinationVersionId(id);
          return deleteProcessRequest({
            name: processItem?.name as string,
            title: processItem?.title as string,
            versionId: id,
          });
        },
      }),
    });
    setIsOpenCreateVersion(false);
  }, [createVersion, processAction, processItem]);
  const handleCloseConflictsModal = useCallback(() => {
    if (hasConflicts) {
      handleResetConflicts();
      return;
    }
    handleResetConflicts();
    navigate(
      getRoutePathWithVersion(ENTITIES_ACTION_MAP[processAction][getActionPath(isMaster(changesDestinationVersionId))]
        .replace(':processName', String(processItem?.name)), changesDestinationVersionId),
    );
  }, [changesDestinationVersionId, handleResetConflicts, hasConflicts, navigate, processAction, processItem?.name]);

  return (
    <>
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
            onLinkClick={handleCreateClick}
          >
            {t('table.createProcess')}
          </InlineButton>
        </Grid>
      </Grid>
      <Table
        columnDefinitions={columnDefinitions}
        list={processItemList}
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
        onChangesToMaster={moveToActionProcessPage}
        description={i18n.t(ENTITIES_ACTION_MAP[processAction].description)}
      />
      <ModalCreateVersion
        isOpen={isOpenCreateVersion}
        onOpenChange={setIsOpenCreateVersion}
        onModalSubmit={handleCreateVersionWithProcess}
      />
      <ModalResultAfterSaveChanges
        hidden={isLoading}
        hasConflicts={hasConflicts}
        onClose={handleCloseConflictsModal}
        title={i18n.t('components~modal.conflict.title')}
        description={i18n.t(ENTITIES_ACTION_MAP[processAction][isMasterList
          ? 'conflictModalDescriptionMaster'
          : 'conflictModalDescriptionCandidate'])}
        textButton={i18n.t(ENTITIES_ACTION_MAP[processAction].conflictModalTextButton)}
      />
    </>
  );
}
