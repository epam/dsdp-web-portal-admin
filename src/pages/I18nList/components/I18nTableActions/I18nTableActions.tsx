import React from 'react';
import { useTranslation } from 'react-i18next';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core';
import { X_PATH } from 'constants/xPath';
import IconButton from '#web-components/components/IconButton';
import EditIcon from '#web-components/assets/icons/edit.svg?react';
import DeleteIcon from '#web-components/assets/icons/delete.svg?react';
import InlineButton from '#web-components/components/InlineButton';

import styles from './I18nTableActions.styles';

type I18nTableActionsProps = {
  onCreateClick: () => void,
  onEditClick: () => void,
  onDeleteClick: () => void,
  i18nBundleExists?: boolean,
  isLoading: boolean,
};

const useStyles = makeStyles(styles, { name: 'I18nTableActions' });

export default function I18nTableActions({
  onCreateClick,
  onEditClick,
  onDeleteClick,
  i18nBundleExists,
  isLoading,
} : I18nTableActionsProps) {
  const classes = useStyles();

  const { t } = useTranslation('pages', { keyPrefix: 'i18nList.table' });

  return (
    <div className={classes.root}>
      {!isLoading && i18nBundleExists && (
        <>
          <IconButton onClick={onEditClick}>
            <EditIcon data-xpath={X_PATH.i18nEditButton} />
          </IconButton>
          <IconButton onClick={onDeleteClick}>
            <DeleteIcon data-xpath={X_PATH.i18nDeleteButton} />
          </IconButton>
        </>
      )}
      {!isLoading && !i18nBundleExists && (
        <InlineButton
          onLinkClick={onCreateClick}
          leftIcon={<AddIcon />}
        >
          {t('actions.create')}
        </InlineButton>
      )}
    </div>
  );
}
