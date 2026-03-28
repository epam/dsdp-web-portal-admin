import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  MenuItem,
  MenuList,
} from '@material-ui/core';
import { X_PATH } from 'constants/xPath';
import IconButton from '#web-components/components/IconButton';
import PopperButton from '#web-components/components/PopperButton';
import { ButtonType } from '#web-components/types/popper';
import EditIcon from '#web-components/assets/icons/edit.svg?react';
import CloneIcon from '#web-components/assets/icons/clone.svg?react';
import ExportIcon from '#web-components/assets/icons/export.svg?react';
import MenuIcon from '#web-components/assets/icons/menu.svg?react';
import styles from './ProcessTableActions.styles';

type FormTableActionsProps = {
  onExportClick?: () => void,
  onCloneClick: () => void,
  onDeleteClick: () => void,
  onEditClick: () => void,
  readonly?: boolean,
};

const useStyles = makeStyles(styles, { name: 'ProcessTableActions' });

export default function ProcessTableActions({
  onExportClick, onCloneClick, onDeleteClick, onEditClick, readonly,
}: FormTableActionsProps) {
  const classes = useStyles();
  const { t } = useTranslation('actions');

  return (
    <div className={classes.root}>
      {!readonly && (
      <>
        <IconButton onClick={onEditClick}>
          <EditIcon data-xpath={X_PATH.formEditButton} />
        </IconButton>
        <IconButton onClick={onCloneClick}>
          <CloneIcon data-xpath={X_PATH.formCloneButton} />
        </IconButton>
      </>
      )}
      {!!onExportClick && (
      <IconButton onClick={onExportClick}>
        <ExportIcon data-xpath={X_PATH.formExportButton} />
      </IconButton>
      )}
      {!readonly && (
      <PopperButton
        buttonType={ButtonType.icon}
        buttonProps={{
          children: <MenuIcon data-xpath={X_PATH.formDeleteButton} />,
        }}
        placement="bottom-end"
      >
        <MenuList className={classes.menuList}>
          <MenuItem
            onClick={onDeleteClick}
            className={classes.menuItem}
          >
            {t('delete')}
          </MenuItem>
        </MenuList>
      </PopperButton>
      ) }
    </div>
  );
}
