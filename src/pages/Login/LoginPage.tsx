import React, { useCallback } from 'react';
import { redirect } from 'react-router';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import StandardLayout from 'components/Layouts/Standard';

import useAuthentication from 'hooks/useAuthentication';
import useQuery from 'hooks/useQuery';
import Button from '#web-components/components/Button';
import Typography from '#web-components/components/Typography';
import Grid from '#web-components/components/Grid';
import styles from './LoginPage.styles';

const useStyles = makeStyles(styles, { name: 'Login' });

export default function LoginPage() {
  const authentication = useAuthentication();
  const query = useQuery();
  const classes = useStyles();
  const { t } = useTranslation('pages', { keyPrefix: 'login' });

  const handleLogin = useCallback((): void => {
    authentication.login();
  }, [authentication]);

  if (authentication.authenticated) {
    if (query.has('logout')) {
      authentication.logout();
    } else {
      return redirect('/');
    }
  }

  return (
    <StandardLayout title="">
      <Grid container className={classes.root}>
        <Grid item desktopS={9}>
          <Typography variant="h2" className={classes.title}>
            {t('title')}
          </Typography>
          <Typography variant="textRegular" className={classes.caption}>
            {t('text.caption')}
          </Typography>
          <Button onClick={handleLogin} size="large">
            {t('text.buttonLabel')}
          </Button>
        </Grid>
      </Grid>
    </StandardLayout>
  );
}
