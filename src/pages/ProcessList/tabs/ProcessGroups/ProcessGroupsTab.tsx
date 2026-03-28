import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import { Grid, makeStyles, Box } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import { notify } from 'reapop';

import GroupedEntityList from '#web-components/components/GroupedEntityList';
import Button, { ButtonVariants } from '#web-components/components/Button/Button';
import { ProcessDefinitionGroup } from '#shared/types/processDefinition';
import ConfirmModal from '#web-components/components/ConfirmModal';
import RouterPrompt from '#shared/utils/RouterPrompt';
import NotificationWarningIcon from '#web-components/components/Icons/NotificationWarningIcon';
import { EntityGroup } from '#web-components/types/groupedEntity';

import { API_APPENDIX } from 'constants/baseUrl';
import {
  getProcessGroupDataRequest,
  getProcessGroupDataClean,
  selectGroupDataEdit,
  selectGroupData,
  groupActionNewGroup,
  saveProcessGroupDataRequest,
  cancelGroupDataEdit,
  selectGroupDataError,
} from 'store/processGroups';
import useVersion from 'hooks/useVersion';
import { isMaster } from 'utils/versions';
import { X_PATH } from 'constants/xPath';

import ProcessTableActions from './components/ProcessTableActions/ProcessTableActions';
import ProcessGroupsTableActions from './components/ProcessGroupsTableActions/ProcessGroupsTableActions';
import ProcessGroupActions from './components/ProcessGroupActions/ProcessGroupActions';
import styles from './ProcessGroupsTab.styles';
import NewGroupControl from './components/NewGroupControl';
import InformationControl from './components/InformationControl';
import ComponentError from '../../../../components/ComponentError/ComponentError';

const useStyles = makeStyles(styles, { name: 'ProcessGroupsTab' });

export default function ProcessGroupsTab() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation('pages', { keyPrefix: 'processList' });
  const groupData = useSelector(selectGroupDataEdit);
  const groupDataOriginal = useSelector(selectGroupData);
  const dataError = useSelector(selectGroupDataError);
  const { versionId } = useVersion();
  const [cancelModalOpen, cancelModalOpenChange] = useState(false);
  const readonly = useMemo(() => isMaster(versionId), [versionId]);
  const [selectedGroup, setSelectedGroup] = useState<ProcessDefinitionGroup | null>(null);

  const convertedGroupList = useMemo((): Array<EntityGroup> => {
    return groupData.groups.map((group) => ({
      ...group,
      entityList: group.processDefinitions,
    }));
  }, [groupData]);
  const onGroupSelect = useCallback((item) => {
    setSelectedGroup(item);
  }, [setSelectedGroup]);
  const existingGroupNames = useMemo(() => groupData.groups.map((group) => group.name), [groupData]);
  const onAddNewGroup = useCallback((name: string) => {
    dispatch(groupActionNewGroup(name));
  }, [dispatch]);
  const onSubmit = useCallback(() => {
    dispatch(saveProcessGroupDataRequest({
      groupData,
      versionId,
    }));
  }, [dispatch, versionId, groupData]);
  const onCancelEdit = useCallback(() => {
    dispatch(notify(t('processGroupsTab.messages.cancelSuccess'), 'success'));
    dispatch(cancelGroupDataEdit());
    cancelModalOpenChange(false);
  }, [dispatch, t]);
  const hasChanges = !isEqual(groupData, groupDataOriginal);

  useEffect(() => {
    dispatch(getProcessGroupDataRequest(versionId));
    return () => {
      dispatch(getProcessGroupDataClean());
    };
  }, [dispatch, versionId]);

  if (typeof dataError === 'string') {
    return (
      <ComponentError icon={<NotificationWarningIcon size={56} />} text={dataError} />
    );
  }

  return (
    <Grid container justifyContent="space-between" className={classes.root}>
      {!readonly && (
        <Grid
          container
          justifyContent="space-between"
          className={selectedGroup ? classes.actionsWrapper : classes.groupActionsWrapper}
        >
          <Box className={classes.actions}>
            {!selectedGroup && (
              <NewGroupControl onAdd={onAddNewGroup} existingGroupNames={existingGroupNames} />
            )}
            <InformationControl />
          </Box>
          <Box className={classes.actions}>
            <Button
              size="large"
              variant={ButtonVariants.primary}
              onClick={onSubmit}
              disabled={!hasChanges}
            >
              {t('processGroupsTab.save')}
            </Button>
            <Button
              size="large"
              variant={ButtonVariants.secondary}
              onClick={() => cancelModalOpenChange(true)}
              disabled={!hasChanges}
            >
              {t('processGroupsTab.cancel')}
            </Button>
          </Box>
        </Grid>
      )}
      <GroupedEntityList
        groupList={convertedGroupList}
        ungroupedList={groupData.ungrouped}
        readonly={readonly}
        onGroupSelect={onGroupSelect}
        existingGroupNames={existingGroupNames}
        SelectedGroupActions={ProcessGroupActions}
        EntityTableActions={ProcessTableActions}
        EntityGroupTableActions={ProcessGroupsTableActions}
        data-xpath={{
          backToGroups: X_PATH.backToGroups,
          groupItemTitle: X_PATH.processList.groupItemTitle,
          ungroupedItemTitle: X_PATH.processList.ungroupedItemTitle,
        }}
        localization={{
          groupsTitle: t('processGroupsTab.groupsTitle'),
          ungroupsTitle: t('processGroupsTab.ungroupsTitle'),
          emptyGroupsPlaceholder: t('processGroupsTab.emptyGroupsPlaceholder'),
          emptyCurrentGroupPlaceholder: t('processGroupsTab.emptyCurrentGroupPlaceholder'),
        }}
      />
      <ConfirmModal
        title={t('modals.cancelChanges.title')}
        confirmationText={t('modals.cancelChanges.description')}
        isOpen={cancelModalOpen}
        submitText={t('modals.cancelChanges.confirm')}
        cancelText={t('modals.cancelChanges.cancel')}
        onSubmit={onCancelEdit}
        onOpenChange={cancelModalOpenChange}
      />
      <RouterPrompt
        text={t('modals.navigationConfirm.text')}
        cancelText={t('modals.navigationConfirm.cancel')}
        title={t('modals.navigationConfirm.title')}
        enabled={hasChanges}
        okText={t('modals.navigationConfirm.ok')}
        baseName={`/${API_APPENDIX}`}
      />
    </Grid>
  );
}
