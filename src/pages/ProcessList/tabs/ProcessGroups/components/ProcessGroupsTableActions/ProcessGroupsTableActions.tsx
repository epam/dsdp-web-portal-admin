import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  makeStyles,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import zIndex from '@material-ui/core/styles/zIndex';

import IconButton from '#web-components/components/IconButton';
import PopperButton from '#web-components/components/PopperButton';
import { ButtonType } from '#web-components/types/popper';
import ArrowUpIcon from '#web-components/components/Icons/ArrowUpIcon';
import ArrowDownIcon from '#web-components/components/Icons/ArrowDownIcon';
import MenuIcon from '#web-components/components/Icons/MenuIcon';
import ConfirmModal from '#web-components/components/ConfirmModal';
import { TrashCanIcon } from '#web-components/components/Icons';
import Typography from '#web-components/components/Typography';
import { EntityGroup } from '#web-components/types/groupedEntity';

import {
  groupActionMoveGroupDown,
  groupActionMoveGroupUp,
  groupActionDeleteGroup,
  groupActionEditGroup,
} from 'store/processGroups';
import { X_PATH } from 'constants/xPath';

import styles from './ProcessGroupsTableActions.styles';
import EditGroupNameModal from '../EditGroupNameModal';

type FormTableActionsProps = {
  item: EntityGroup,
  list: Array<EntityGroup>,
  readonly?: boolean,
};

const useStyles = makeStyles(styles, { name: 'ProcessGroupsTableActions' });

export default function ProcessGroupsTableActions({
  readonly,
  item,
  list,
}: FormTableActionsProps) {
  const classes = useStyles({ readonly });
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'processList' });
  const index = list.indexOf(item);
  const [editModalOpen, onEditModalOpenChange] = useState(false);
  const [deletionModalOpen, onDeleteModalOpenChange] = useState(false);
  const existingGroupNames = useMemo(
    () => list
      .map((group) => group.name),
    [list],
  );

  const onUpClick = useCallback(() => {
    dispatch(groupActionMoveGroupUp(item.name));
  }, [item, dispatch]);
  const onDownClick = useCallback(() => {
    dispatch(groupActionMoveGroupDown(item.name));
  }, [item, dispatch]);
  const onDelete = useCallback(() => {
    dispatch(groupActionDeleteGroup(item.name));
  }, [item, dispatch]);
  const onGroupNameEdit = useCallback((newName: string) => {
    dispatch(groupActionEditGroup({
      name: item.name,
      newName,
    }));
  }, [item, dispatch]);

  return (
    <Box className={classes.root}>
      {!readonly && (
        <>
          <IconButton onClick={onUpClick} disabled={index === 0} data-xpath={X_PATH.arrowUpButton}>
            <ArrowUpIcon />
          </IconButton>
          <IconButton onClick={onDownClick} disabled={index === list.length - 1} data-xpath={X_PATH.arrowDownButton}>
            <ArrowDownIcon />
          </IconButton>
        </>
      )}
      {!readonly && (
        <PopperButton
          buttonType={ButtonType.icon}
          buttonProps={{
            children: <MenuIcon />,
            'data-xpath': X_PATH.menuButton,
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
      )}
      {editModalOpen && (
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
      )}
      {deletionModalOpen && (
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
      )}
    </Box>
  );
}
