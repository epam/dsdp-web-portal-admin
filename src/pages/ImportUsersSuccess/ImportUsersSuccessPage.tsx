import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, makeStyles } from '@material-ui/core';
import { ROUTES } from 'constants/routes';
import { KIBANA_URL, USER_LOAD_LOG_FILTER_URL } from 'constants/baseUrl';
import { getRoutePathWithVersion } from 'utils/versions';
import useVersion from 'hooks/useVersion';
import Button from '#web-components/components/Button';
import Typography from '#web-components/components/Typography';
import FlashMessage from '#web-components/components/FlashMessage';
import CommonLayout from 'components/Layouts/CommonLayout';

import { useNavigate } from 'react-router';
import styles from './ImportUsersSuccessPage.styles';

const useStyles = makeStyles(styles, { name: 'ImportUsersSuccess' });

export default function ImportUsersSuccess() {
  const { t } = useTranslation('pages', { keyPrefix: 'importUsers' });
  const navigate = useNavigate();
  const classes = useStyles();
  const { versionId } = useVersion();

  const handler = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.USERS, versionId));
  }, [navigate, versionId]);

  return (
    <CommonLayout
      title={t('title')}
      isLoading={false}
    >
      <Box className={classes.wrapper}>
        <FlashMessage
          status="success"
          title={t('text.fileAccepted')}
          message={(
            <Box>
              <Typography>
                {t('text.checkResult')}&nbsp;
                <a
                  href={`${KIBANA_URL}${USER_LOAD_LOG_FILTER_URL}`}
                  className={classes.kibanaLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('text.byLink')}
                </a>.
              </Typography>
            </Box>
          )}
        />
        <Button className={classes.clearlyButton} onClick={handler} size="large">
          {t('actions.clearly')}
        </Button>
      </Box>
    </CommonLayout>
  );
}
