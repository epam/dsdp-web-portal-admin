import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, makeStyles } from '@material-ui/core';
import FlashMessage from '#web-components/components/FlashMessage';

import styles from './FormInvalidJson.styles';

const useStyles = makeStyles(styles, { name: 'FormInvalidJson' });

export default function FormInvalidJson() {
  const classes = useStyles();
  const { t } = useTranslation('domains');
  return (
    <Box className={classes.root}>
      <FlashMessage
        status="error"
        title={t('form.validation.wrongJson.title')}
        message={t('form.validation.wrongJson.message')}
      />
    </Box>
  );
}
