import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, makeStyles } from '@material-ui/core';
import { ROUTES } from 'constants/routes';
import CommonLayout from 'components/Layouts/CommonLayout';
import { KIBANA_URL, USER_LOAD_LOG_FILTER_URL } from 'constants/baseUrl';
import { getRoutePathWithVersion } from 'utils/versions';
import useVersion from 'hooks/useVersion';
import Button from '#web-components/components/Button';
import Typography from '#web-components/components/Typography';

import { useNavigate } from 'react-router';
import styles from './UserListPage.styles';

const useStyles = makeStyles(styles, { name: 'UserListPage' });

export default function UserListPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'userList' });
  const { versionId } = useVersion();
  const classes = useStyles();

  const addUsers = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.IMPORT_USERS, versionId));
  }, [navigate, versionId]);

  return (
    <CommonLayout title={t('title')} hint={i18n.t('text~hintSection')}>
      <Typography variant="h4" className={classes.addUsersRegistry}>{t('text.addUsersRegistry')}</Typography>
      <Box className={classes.description}>
        <Typography variant="textRegular">{t('text.description')}</Typography>
        <Typography variant="textRegular" className={classes.lookingResult}>
          {t('text.lookingResult')}&nbsp;
          <a
            href={`${KIBANA_URL}${USER_LOAD_LOG_FILTER_URL}`}
            className={classes.kibanaLink}
            target="_blank"
            rel="noreferrer"
          >
            {t('text.kibanaService')}
          </a>.
        </Typography>
      </Box>
      <Button onClick={addUsers} size="large">
        {t('actions.addUsers')}
      </Button>
    </CommonLayout>
  );
}
