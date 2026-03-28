import React, { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, MenuItem, makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { getMasterRequest, selectMaster } from 'store/versions';
import ColoredBox from '#web-components/components/ColoredBox';
import Typography from '#web-components/components/Typography';
import { formatUTCDateTime } from '#web-components/utils';
import DropdownMenu from '#web-components/components/DropdownMenu/DropdownMenu';
import CheckListItem from 'components/CheckListItem/CheckListItem';
import styles from './Master.styles';

const useStyles = makeStyles(styles, { name: 'Master' });

export default function Master() {
  const dispatch = useDispatch();
  const master = useSelector(selectMaster);
  const classes = useStyles();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'home' });

  useEffect(() => {
    dispatch(getMasterRequest());
  }, [dispatch]);

  const openCicdTool = useCallback(() => {
    window.open(
      ENVIRONMENT_VARIABLES.cicdUrl
      || `${window.location.origin}/cicd/job/registry-regulations/job/MASTER-Build-registry-regulations/`,
      '_blank',
    );
  }, []);

  return (
    <ColoredBox>
      <Typography variant="h2">{t('text.masterVersionRegulations')}</Typography>

      {master?.latestUpdate && (
        <Box className={classes.info}>
          <Typography variant="textTiny" className={classes.label}>{t('text.lastModifiedDate')}</Typography>
          <Typography variant="textRegular">{formatUTCDateTime(master.latestUpdate, i18n.language)}</Typography>
        </Box>
      )}

      {master?.description && (
        <Box className={classes.description}>
          <Typography variant="textTiny" className={classes.label}>{t('text.descriptionOfChange')}</Typography>
          <Typography variant="textRegular">{master.description}</Typography>
        </Box>
      )}
      {master?.status && (
        <CheckListItem
          status={master.status}
          successMessage={t('text.regulationSuccess')}
          failedMessage={t('text.regulationFailed')}
          pendingMessage={t('text.regulationsPending')}
          className={classes.checks}
        />
      )}
      <Box className={classes.buttons}>
        <Box className={classes.buttonItem}>
          <DropdownMenu
            triggerElement={<Typography variant="h7">{t('text.links')}</Typography>}
          >
            <MenuItem
              onClick={openCicdTool}
              className={classes.menuItem}
            >
              {t('actions.openCicdTool')}
            </MenuItem>
          </DropdownMenu>
        </Box>
      </Box>
    </ColoredBox>
  );
}
