import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useNavigate } from 'react-router';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Box, makeStyles } from '@material-ui/core';

import {
  createI18nRequest,
  deleteI18nRequest,
  getI18nListClean,
  getI18nByNameClean,
  getI18nByNameRequest,
  getI18nListRequest,
  selectI18nList,
  selectI18nListIsLoading,
  selectHasConflicts,
  selectI18nByName,
  setHasConflicts,
  updateI18nRequest,
} from 'store/i18n';

import CommonLayout from 'components/Layouts/CommonLayout';
import Table from 'components/Table';
import useVersion from 'hooks/useVersion';
import { getLanguageNativeName } from 'utils/i18n';
import { getRoutePathWithVersion, isMaster } from 'utils/versions';
import { ColumnDefinition, Order } from '#web-components/types/table';
import Typography from '#web-components/components/Typography';

import ModalCreateVersion from 'components/modals/ModalCreateVersion';
import ModalResultAfterSaveChanges from 'components/modals/ModalResultAfterSaveChanges';
import ModalWhereToSaveChanges, {
  ENTITIES_ACTION_MAP,
  ENTITY_ACTION,
  getActionPath,
} from 'components/modals/ModalWhereToSaveChanges';
import { CreateVersion } from 'types/versions';
import { I18nListItem } from 'types/i18n';
import { MASTER_VERSION_ID } from 'constants/common';
import styles from './I18nListPage.styles';
import I18nTableActions from './components/I18nTableActions';
import ModalEditI18n from './components/ModalEditI18n';
import ModalDeleteI18n from './components/ModalDeleteI18n';

const useStyles = makeStyles(styles, { name: 'I18nList' });

export default function I18nListPage() {
  const navigate = useNavigate();
  const classes = useStyles();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'i18nList' });
  const dispatch = useDispatch();

  const { createVersion, versionCreateIsLoading, versionId } = useVersion();
  const isMasterVersion = isMaster(versionId);
  const [editI18nModalState, setEditI18nModalState] = useState({ show: false, isNewI18n: false });
  const [fileContent, setFileContent] = useState('');
  const [isOpenDeleteI18n, setIsOpenDeleteI18n] = useState(false);
  const [isOpenWhereToSaveChanges, setIsOpenWhereToSaveChanges] = useState(false);
  const [isOpenCreateVersion, setIsOpenCreateVersion] = useState(false);
  const [changesDestinationVersionId, setChangesDestinationVersionId] = useState<string>(versionId);
  const [i18nTitle, setI18nTitle] = useState<string>();
  const [i18nItem, setI18nItem] = useState<I18nListItem>();
  const [i18nAction, setI18nAction] = useState<ENTITY_ACTION>(ENTITY_ACTION.DELETE_I18N);

  const i18nList = useSelector(selectI18nList);
  const i18nContent = useSelector(selectI18nByName);
  const i18nListIsLoading = useSelector(selectI18nListIsLoading);
  const hasConflicts = useSelector(selectHasConflicts);
  const isLoading = i18nListIsLoading || versionCreateIsLoading;

  // load i18n bundle list
  useEffect(() => {
    dispatch(getI18nListRequest(versionId));
    return () => {
      dispatch(getI18nListClean());
    };
  }, [dispatch, versionId]);

  // define supported languages
  const supportedLanguages = useMemo(() => {
    return ENVIRONMENT_VARIABLES.supportedLanguages.map((item) => (
      {
        ...i18nList.find((i18nListItem) => i18nListItem.name === item) as I18nListItem,
        id: item,
        name: item,
        title: getLanguageNativeName(item),
      }
    ));
  }, [i18nList]);

  // handle delete icon click
  const handleDeleteClick = useCallback((item) => () => {
    setI18nItem(item);
    setI18nTitle(item.title);
    setIsOpenDeleteI18n(true);
  }, []);

  // handle edit icon click
  const handleEditIconClick = useCallback((item) => () => {
    setI18nItem(item);
    setI18nTitle(item.title);
    setEditI18nModalState({ show: true, isNewI18n: false });
    dispatch(getI18nByNameRequest({ versionId, name: item.name }));
  }, [dispatch, versionId]);

  // handle create button click
  const handleCreateButtonClick = useCallback((item) => () => {
    setI18nItem(item);
    setI18nTitle(item.title);
    setEditI18nModalState({ show: true, isNewI18n: true });
  }, []);

  // define column definition for table
  const columnDefinitions: ColumnDefinition[] = useMemo(() => [
    {
      // title is empty because it's not visible
      title: '',
      property: 'title',
    },
    {
      // title is empty because it's not visible
      title: '',
      property: '',
      // eslint-disable-next-line react/no-unstable-nested-components
      Component({ item }) {
        return (
          <I18nTableActions
            onCreateClick={handleCreateButtonClick(item)}
            onEditClick={handleEditIconClick(item)}
            onDeleteClick={handleDeleteClick(item)}
            i18nBundleExists={i18nList.some((i18nListItem) => i18nListItem.name === item.id)}
            isLoading={isLoading}
          />
        );
      },
    },
  ], [isLoading, handleCreateButtonClick, handleDeleteClick, handleEditIconClick, i18nList]);

  // hande submit button click on popup
  const createI18n = useCallback(() => {
    dispatch(createI18nRequest({ versionId, name: i18nItem?.name as string, i18nContent: fileContent }));
  }, [dispatch, fileContent, i18nItem?.name, versionId]);
  const updateI18n = useCallback(() => {
    dispatch(updateI18nRequest({ versionId, name: i18nItem?.name as string, i18nContent: fileContent }));
  }, [dispatch, fileContent, i18nItem?.name, versionId]);
  const handleSubmitEdit = useCallback(() => {
    const { isNewI18n } = editI18nModalState;
    setEditI18nModalState({ show: false, isNewI18n: false });
    if (isMasterVersion) {
      setIsOpenWhereToSaveChanges(true);
      setI18nAction(isNewI18n ? ENTITY_ACTION.CREATE_I18N : ENTITY_ACTION.EDIT_I18N);
      return;
    }
    if (isNewI18n) {
      createI18n();
    } else {
      updateI18n();
    }
  }, [createI18n, editI18nModalState, isMasterVersion, updateI18n]);

  // handle delete affirmation
  const deleteI18n = useCallback((item) => {
    const { id } = item;
    dispatch(deleteI18nRequest({ name: id, versionId }));
  }, [dispatch, versionId]);

  const handleAffirmationDeleteClick = useCallback(() => {
    setIsOpenDeleteI18n(false);
    if (isMasterVersion) {
      setIsOpenWhereToSaveChanges(true);
      setI18nAction(ENTITY_ACTION.DELETE_I18N);
      return;
    }
    deleteI18n(i18nItem);
  }, [deleteI18n, i18nItem, isMasterVersion]);

  // handle versions changes
  const acceptChangesToMaster = useCallback(() => {
    setIsOpenWhereToSaveChanges(false);
    setChangesDestinationVersionId(MASTER_VERSION_ID);
    if (i18nAction === ENTITY_ACTION.DELETE_I18N) {
      deleteI18n(i18nItem);
      return;
    }
    if (i18nAction === ENTITY_ACTION.EDIT_I18N) {
      updateI18n();
      return;
    }
    if (i18nAction === ENTITY_ACTION.CREATE_I18N) {
      createI18n();
    }
  }, [createI18n, deleteI18n, i18nAction, i18nItem, updateI18n]);

  const versionCandidateAction = useCallback((id: string) => {
    setChangesDestinationVersionId(id);
    switch (i18nAction) {
      case ENTITY_ACTION.DELETE_I18N:
        return deleteI18nRequest({
          name: i18nItem?.name as string,
          versionId: id,
        });
      case ENTITY_ACTION.EDIT_I18N:
        return updateI18nRequest({
          name: i18nItem?.name as string,
          i18nContent: fileContent,
          versionId: id,
        });
      case ENTITY_ACTION.CREATE_I18N:
        return createI18nRequest({
          name: i18nItem?.name as string,
          i18nContent: fileContent,
          versionId: id,
        });
      default:
        return getI18nByNameClean();
    }
  }, [fileContent, i18nAction, i18nItem?.name]);
  const handleCreateVersion = useCallback((data: CreateVersion) => {
    setIsOpenCreateVersion(false);
    createVersion({
      data,
      path: ENTITIES_ACTION_MAP[i18nAction].path,
      state: i18nItem,
      nextAction: versionCandidateAction,
    });
  }, [createVersion, i18nAction, i18nItem, versionCandidateAction]);

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
      ENTITIES_ACTION_MAP[i18nAction][getActionPath(isMaster(changesDestinationVersionId))],
      changesDestinationVersionId,
    ));
  }, [hasConflicts, handleResetConflicts, navigate, i18nAction, changesDestinationVersionId]);

  return (
    <CommonLayout title={t('title')} isLoading={isLoading}>
      <Typography variant="textRegular" className={classes.availableLanguagesLabel}>
        { t('text.availableLanguages') }
      </Typography>
      <Box className={classes.table}>
        <Table
          columnDefinitions={columnDefinitions}
          list={supportedLanguages}
          order={Order.asc}
          orderField="title"
          onOrderChange={() => {}}
          emptyPlaceholder={t('table.emptyPlaceholder')}
          showAllRows
          hideHeader
          hidePaginationControls
        />
      </Box>
      <ModalDeleteI18n
        isOpen={isOpenDeleteI18n}
        onOpenChange={setIsOpenDeleteI18n}
        onDelete={handleAffirmationDeleteClick}
        i18nTitle={i18nTitle}
      />
      <ModalWhereToSaveChanges
        isOpen={isOpenWhereToSaveChanges}
        onOpenChange={setIsOpenWhereToSaveChanges}
        onOpenCreateVersion={setIsOpenCreateVersion}
        onChangesToMaster={acceptChangesToMaster}
        description={i18n.t(ENTITIES_ACTION_MAP[i18nAction].description)}
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
        description={i18n.t(ENTITIES_ACTION_MAP[i18nAction][isMasterVersion
          ? 'conflictModalDescriptionMaster'
          : 'conflictModalDescriptionCandidate'])}
        textButton={i18n.t(ENTITIES_ACTION_MAP[i18nAction].conflictModalTextButton)}
      />
      <ModalEditI18n
        isOpen={editI18nModalState.show}
        onOpenChange={(isOpen) => setEditI18nModalState({ show: isOpen, isNewI18n: editI18nModalState.isNewI18n })}
        isNewI18n={editI18nModalState.isNewI18n}
        onSubmit={handleSubmitEdit}
        i18nTitle={i18nTitle}
        fileContent={i18nContent as string}
        setFileContent={setFileContent}
      />
    </CommonLayout>
  );
}
