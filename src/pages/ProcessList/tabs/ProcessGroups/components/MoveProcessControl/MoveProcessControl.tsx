import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { X_PATH } from 'constants/xPath';
import {
  groupActionMoveProcess,
  groupActionNewGroupWithProcess,
  groupActionMoveToUngrouped,
} from 'store/processGroups';

import { ProcessDefinition } from '#shared/types/processDefinition';
import IconButton from '#web-components/components/IconButton/IconButton';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import MoveProcessModal from '../MoveProcessModal';

interface Props {
  process: ProcessDefinition;
  groupName?: string;
  moveToUngroupedEnable?: boolean;
  existingGroupNames?: Array<string>;
}

export default function MoveProcessControl(props: Props) {
  const {
    process, groupName, existingGroupNames = [], moveToUngroupedEnable,
  } = props;
  const { t } = useTranslation('pages', { keyPrefix: 'processList' });
  const dispatch = useDispatch();
  const [open, onOpenChange] = useState(false);

  const handleMoveToGroup = useCallback((processDefinition, group, currentGroup) => {
    onOpenChange(false);
    dispatch(groupActionMoveProcess({ processDefinition, groupName: group, currentGroup }));
  }, [dispatch]);

  const handleMoveToNewGroup = useCallback((processDefinition, group, currentGroup) => {
    onOpenChange(false);
    dispatch(groupActionNewGroupWithProcess({ processDefinition, groupName: group, currentGroup }));
  }, [dispatch]);

  const handleMoveToUngrouped = useCallback((processDefinition, group) => {
    onOpenChange(false);
    dispatch(groupActionMoveToUngrouped({ processDefinition, groupName: group }));
  }, [dispatch]);

  return (
    <>
      <IconButton onClick={() => onOpenChange(true)} data-xpath={X_PATH.folderArrowButton}>
        <CreateNewFolderIcon />
      </IconButton>
      {open && (
        <MoveProcessModal
          text={{
            title: t('modals.moveProcess.moveTitle'),
            description: t('modals.moveProcess.moveDescription', { processName: process.name }),
            selectLabel: t('modals.moveProcess.moveLabel'),
            groupFieldLabel: t('modals.moveProcess.addLabel'),
            moveButtonLabel: t('modals.moveProcess.moveSubmitButton'),
            existingGroupNamesLabel: t('modals.moveProcess.moveLabel'),
            placeholder: t('modals.moveProcess.placeholder'),
            moveToNewGroup: t('modals.moveProcess.moveToNewGroup'),
            excludeFromGroup: t('modals.moveProcess.excludeFromGroup'),
          }}
          process={process}
          groupFieldValue={groupName}
          existingGroupNames={existingGroupNames}
          isOpen={open}
          onOpenChange={onOpenChange}
          onMoveToGroup={handleMoveToGroup}
          onMoveToNewGroup={handleMoveToNewGroup}
          onMoveToUngrouped={handleMoveToUngrouped}
          moveToUngroupedEnable={moveToUngroupedEnable}
        />
      )}
    </>
  );
}
