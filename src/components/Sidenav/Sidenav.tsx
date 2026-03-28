import React from 'react';
import {
  Box, makeStyles,
} from '@material-ui/core';
import { NavLink as RouterNavLink, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from 'constants/routes';
import { getRoutePathWithVersion } from 'utils/versions';
import { isGlobal } from 'utils/region';
import useVersion from 'hooks/useVersion';

import NavLink from '#web-components/components/Navbar/components/NavLink';
import Typography from '#web-components/components/Typography';
import Accordion from '#web-components/components/Accordion';

import styles from './Sidenav.styles';

const useStyles = makeStyles(styles, { name: 'Sidenav' });

type NavLinks = {
  title: string;
  hideForGlobal?: boolean;
  items: Array<{
    title: string;
    path: string;
    subItems?: Array<{ title: string; path: string }>;
  }>
};

const NAV_LINKS: NavLinks[] = [
  {
    title: 'nav.regulationVersionManagement',
    items: [
      {
        title: 'nav.versionOverview',
        path: ROUTES.HOME,
      },
    ],
  },
  {
    title: 'nav.organizationalStructure',
    hideForGlobal: true,
    items: [
      {
        title: 'nav.userManagement',
        path: ROUTES.USERS,
      },
    ],
  },
  {
    title: 'nav.modelingRegulations',
    items: [
      {
        title: 'nav.bpModels',
        path: ROUTES.PROCESS_LIST,
      },
      {
        title: 'nav.formUI',
        path: ROUTES.FORM_LIST,
      },
      {
        title: 'nav.mailSettings',
        path: ROUTES.GLOBAL_SETTINGS,
      },
    ],
  },
  {
    title: 'nav.translationManagement',
    items: [
      {
        title: 'nav.regulationTranslations',
        path: ROUTES.I18N_LIST,
      },
    ],
  },
];

export default function Sidenav() {
  const classes = useStyles();
  const { t } = useTranslation('components');
  const { versionId } = useVersion();
  const location = useLocation();
  const pathnameSplit = location.pathname.split('/');
  const path = pathnameSplit.length ? pathnameSplit[pathnameSplit.length - 1] : pathnameSplit[0];

  const navLinks = isGlobal(ENVIRONMENT_VARIABLES.region)
    ? NAV_LINKS.filter(({ hideForGlobal }) => !hideForGlobal)
    : NAV_LINKS;

  return (
    <>
      {navLinks.map((link) => (
        <div key={link.title}>
          <Typography
            variant="textTiny"
            className={classes.title}
          >
            {t(link.title)}
          </Typography>
          {
            link.items?.map((item) => (
              item.subItems
                ? (
                  <Accordion
                    label={t(item.title)}
                    fullWidth
                    expanded
                    key={`${item.title}Accordion`}
                  >
                    {item.subItems.map((subItem) => (
                      <Box key={subItem.path} className={classes.link}>
                        <NavLink
                          name={t(subItem.title)}
                          component={RouterNavLink}
                          to={`${getRoutePathWithVersion(subItem.path, versionId)}`}
                          selected={subItem.path === `/:versionId/${path}`}
                        />
                      </Box>
                    ))}
                  </Accordion>
                )
                : (
                  <Box key={item.path} className={classes.link}>
                    <NavLink
                      key={item.path}
                      name={t(item.title)}
                      component={RouterNavLink}
                      to={`${getRoutePathWithVersion(item.path, versionId)}`}
                      selected={item.path === `/:versionId/${path}`}
                    />
                  </Box>
                )
            ))
          }
        </div>
      ))}
    </>
  );
}
