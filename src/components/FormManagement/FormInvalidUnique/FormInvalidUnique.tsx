import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, makeStyles } from '@material-ui/core';
import FlashMessage from '#web-components/components/FlashMessage';

import styles from './FormInvalidUnique.styles';

const useStyles = makeStyles(styles, { name: 'FormInvalidUnique' });

export default function FormInvalidUnique() {
  const classes = useStyles();
  const { t } = useTranslation('domains');
  return (
    <Box className={classes.root}>
      <FlashMessage
        status="error"
        title={t('form.validation.wrongUnique.title')}
        message={t('form.validation.wrongUnique.message')}
      />
    </Box>
  );
}
