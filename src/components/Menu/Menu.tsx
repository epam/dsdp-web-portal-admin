import React, { useCallback } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'constants/routes';
import { X_PATH } from 'constants/xPath';
import useAuthentication from 'hooks/useAuthentication';
import { Box, makeStyles } from '@material-ui/core';
import MenuItem from '#web-components/components/MenuList/components/MenuItem';
import DropdownMenu from '#web-components/components/DropdownMenu';
import Typography from '#web-components/components/Typography';

import { useNavigate } from 'react-router';
import styles from './Menu.styles';

const useStyles = makeStyles(styles, { name: 'Menu' });

export default function Menu() {
  const classes = useStyles();
  const authentication = useAuthentication();
  const navigate = useNavigate();
  const userInfo = authentication.info;
  const { t } = useTranslation('components', { keyPrefix: 'header' });

  const handleLogout = useCallback((): void => {
    navigate(`${ROUTES.LOGIN}?logout`);
  }, [navigate]);

  if (!(authentication.authenticated)) {
    return null;
  }

  return (
    <Box className={classes.menu}>
      <DropdownMenu
        triggerElement={(
          <Typography variant="accentSmallCompact">
            {`${userInfo?.given_name} ${userInfo?.family_name?.charAt(0)}.`}
          </Typography>
        )}
        classes={
          clsx(classes.name, classes.enabled)
        }
        placement="bottom-end"
      >
        <div>
          {userInfo?.name && (
            <MenuItem>
              {userInfo?.name}
            </MenuItem>
          )}
          <MenuItem
            data-xpath={X_PATH.logout}
            onClick={handleLogout}
          >
            {t('actions.logout')}
          </MenuItem>
        </div>
      </DropdownMenu>
    </Box>
  );
}
