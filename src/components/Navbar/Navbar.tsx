import React from 'react';
import { Link as RouterLink } from 'react-router';
import { Box, makeStyles } from '@material-ui/core';
import Menu from 'components/Menu';
import { X_PATH } from 'constants/xPath';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'constants/routes';
import useVersion from 'hooks/useVersion';
import { getRoutePathWithVersion } from 'utils/versions';
import LogoIcon from 'components/LogoImage';
import LogoLink from '#web-components/components/Navbar/components/LogoLink';
import NavbarContainer from '#web-components/components/Navbar';

import styles from './Navbar.styles';

const useStyles = makeStyles(styles, { name: 'Navbar' });

interface NavBarProps {
  disableBackground?: boolean
}

const Navbar: React.FC<NavBarProps> = ({ disableBackground }) => {
  const classes = useStyles();
  const { t } = useTranslation('text');

  const { versionId } = useVersion();
  return (
    <NavbarContainer disableBackground={disableBackground} data-xpath={X_PATH.header}>
      <Box className={classes.box}>
        <LogoLink
          direction="left"
          homePath={getRoutePathWithVersion(ROUTES.HOME, versionId)}
          appTitle={t('text~appTitle')}
          navLinkComponent={RouterLink}
          logoIcon={<LogoIcon />}
        />
        <Menu />
      </Box>
    </NavbarContainer>
  );
};

export default Navbar;
