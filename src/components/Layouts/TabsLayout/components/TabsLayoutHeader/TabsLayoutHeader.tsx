import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { X_PATH } from 'constants/xPath';
import CloseIcon from '@material-ui/icons/Close';
import VersionMenu from 'components/VersionMenu';
import Navbar from '#web-components/components/Navbar';
import IconButton from '#web-components/components/IconButton';
import Button, { ButtonVariants } from '#web-components/components/Button';

import styles from './TabsLayoutHeader.styles';

export interface TabsLayoutHeaderProps {
  submitButtonText?: string;
  onSubmit?: () => void;
  onEditMode?:() => void;
  onCancel: () => void;
}

const useStyles = makeStyles(styles, { name: 'TabsLayoutHeader' });

export default function TabsLayoutHeader({
  submitButtonText,
  onSubmit,
  onEditMode,
  onCancel,
}: TabsLayoutHeaderProps) {
  const classes = useStyles();
  const { t } = useTranslation('actions');
  return (
    <Navbar disableBackground data-xpath={X_PATH.header} className={classes.navbar}>
      <Box className={classes.header}>
        <VersionMenu onCreateButtonClick={() => {}} disabled dataXpath={{ versionName: X_PATH.versionName }} />
        <div className={classes.right}>
          {submitButtonText && (
            <Button onClick={onSubmit} size="medium" className={classes.button}>
              { submitButtonText }
            </Button>
          )}
          {onEditMode && (
            <Button onClick={onEditMode} size="medium" variant={ButtonVariants.secondary} className={classes.button}>
              { t('goToEditingMode') }
            </Button>
          )}
          <IconButton size="large" onClick={onCancel} className={classes.button}>
            <CloseIcon />
          </IconButton>
        </div>
      </Box>
    </Navbar>
  );
}
