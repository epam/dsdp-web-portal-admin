import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  makeStyles,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import zIndex from '@material-ui/core/styles/zIndex';

import { X_PATH } from 'constants/xPath';
import { groupActionDeleteGroup, groupActionEditGroup, selectGroupDataEdit } from 'store/processGroups';
import PopperButton from '#web-components/components/PopperButton';
import { ButtonType } from '#web-components/types/popper';
import MenuIcon from '#web-components/assets/icons/menu.svg?react';
import ConfirmModal from '#web-components/components/ConfirmModal';
import { TrashCanIcon } from '#web-components/components/Icons';
import Typography from '#web-components/components/Typography';
import { EntityGroup } from '#web-components/types/groupedEntity';

import styles from './ProcessGroupActions.styles';
import EditGroupNameModal from '../EditGroupNameModal';

type FormTableActionsProps = {
  item: EntityGroup,
  unselectGroup: () => void;
};

const useStyles = makeStyles(styles, { name: 'ProcessGroupsTableActions' });

export default function ProcessGroupActions({
  item,
  unselectGroup,
}: FormTableActionsProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { groups } = useSelector(selectGroupDataEdit);
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'processList' });
  const [editModalOpen, onEditModalOpenChange] = useState(false);
  const [deletionModalOpen, onDeleteModalOpenChange] = useState(false);
  const existingGroupNames = useMemo(
    () => groups
      .map((group) => group.name),
    [groups],
  );

  const onGroupNameEdit = useCallback((newName: string) => {
    dispatch(groupActionEditGroup({
      name: item.name,
      newName,
    }));
  }, [item, dispatch]);
  const onDelete = useCallback(() => {
    dispatch(groupActionDeleteGroup(item.name));
    unselectGroup();
  }, [item, dispatch, unselectGroup]);

  return (
    <>
      <PopperButton
        buttonType={ButtonType.icon}
        buttonProps={{
          children: <MenuIcon />,
        }}
        placement="bottom-end"
        zIndex={zIndex.modal - 1}
        disablePortal
      >
        <MenuList className={classes.menuList}>
          <MenuItem
            onClick={() => onEditModalOpenChange(true)}
            className={classes.menuItem}
            data-xpath={X_PATH.menuRename}
          >
            {i18n.t('actions~rename')}
          </MenuItem>
          <MenuItem
            onClick={() => onDeleteModalOpenChange(true)}
            className={classes.menuDelete}
            data-xpath={X_PATH.menuDelete}
          >
            {i18n.t('actions~delete')}
          </MenuItem>
        </MenuList>
      </PopperButton>
      <EditGroupNameModal
        groupFieldValue={item.name}
        text={{
          title: t('modals.groupName.editTitle'),
          groupFieldLabel: t('modals.groupName.editLabel'),
          addButtonLabel: t('modals.groupName.editSubmitButton'),
        }}
        existingGroupNames={existingGroupNames}
        isOpen={editModalOpen}
        onOpenChange={onEditModalOpenChange}
        onSubmit={onGroupNameEdit}
      />
      <ConfirmModal
        title={t('modals.deleteConfirmation.confirmTitle')}
        confirmationText={t('modals.deleteConfirmation.confirmText', { groupName: item.name })}
        isOpen={deletionModalOpen}
        submitText={t('modals.deleteConfirmation.approve')}
        cancelText={t('modals.deleteConfirmation.cancel')}
        onSubmit={onDelete}
        onOpenChange={onDeleteModalOpenChange}
        icon={<Typography variant="h1"><TrashCanIcon /></Typography>}
      />
    </>
  );
}
