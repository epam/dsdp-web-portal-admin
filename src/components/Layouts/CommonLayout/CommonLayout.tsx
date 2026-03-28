import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Grid, Box, makeStyles } from '@material-ui/core';
import { NavLink as RouterNavLink } from 'react-router';

import useVersion from 'hooks/useVersion';
import Menu from 'components/Menu';
import Sidenav from 'components/Sidenav';
import ErrorLayout from 'components/Layouts/Error';
import VersionMenu from 'components/VersionMenu';
import { X_PATH } from 'constants/xPath';
import { selectorAsyncActionCriticalErrors } from 'store/asyncAction/selectors';
import { CreateVersion } from 'types/versions';

import { ErrorInfo } from '#shared/types/common';
import NavbarContainer from '#web-components/components/Navbar';
import Typography from '#web-components/components/Typography';
import FlashMessage, { ViewType } from '#web-components/components/FlashMessage';

import ModalCreateVersion from 'components/modals/ModalCreateVersion';
import Loader from 'components/Loader';
import { ROUTES } from 'constants/routes';
import InlineButton from '#web-components/components/InlineButton';
import LanguageSwitcher from '#web-components/components/LanguageSwitcher';
import { ArrowLeftIcon } from '#web-components/components/Icons';
import { useTranslation } from 'react-i18next';
import styles from './CommonLayout.styles';

const useStyles = makeStyles(styles, { name: 'CommonLayout' });

interface CommonLayoutProps {
  children: React.ReactNode;
  title?: string;
  isLoading?: boolean;
  loaderDescription?: string;
  error?: ErrorInfo;
  hint?: string;
  titleVariant?: 'h1' | 'h2';
  backLink?: {
    title: string,
    path: string,
  };
}

export default function CommonLayout({
  title,
  error,
  isLoading = false,
  children,
  hint,
  backLink,
  titleVariant = 'h1',
  loaderDescription,
}: CommonLayoutProps) {
  const classes = useStyles();
  const { i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { versionIsLoading, createVersion } = useVersion();
  const criticalError = useSelector(selectorAsyncActionCriticalErrors);
  const languageList = ENVIRONMENT_VARIABLES.supportedLanguages;

  const handleChangeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
  }, [i18n]);

  const handleCreateButtonClick = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback((data: CreateVersion) => {
    createVersion({ data, path: ROUTES.HOME });
    setIsModalOpen(false);
  }, [createVersion]);

  if (criticalError || error) {
    return (
      <ErrorLayout
        error={criticalError || error}
      />
    );
  }

  return (
    <>
      <NavbarContainer disableBackground className={classes.navbar} data-xpath={X_PATH.header}>
        <Box className={classes.header}>
          <VersionMenu onCreateButtonClick={handleCreateButtonClick} dataXpath={{ versionName: X_PATH.versionName }} />
          <div className={languageList.length ? classes.headerAction : ''}>
            <LanguageSwitcher
              language={i18n.language}
              languageList={languageList}
              onChange={handleChangeLanguage}
            />
            <Menu />
          </div>
        </Box>
      </NavbarContainer>
      <Grid wrap="nowrap" container>
        <Grid className={classes.sidebar} item data-xpath={X_PATH.sidenav}>
          <Sidenav />
        </Grid>
        <Grid className={classes.container} item data-xpath={X_PATH.commonLayoutContent}>
          <Loader
            show={isLoading || versionIsLoading}
            description={loaderDescription}
            data-xpath="component-loader"
          />
          {
            backLink && (
              <InlineButton
                size="medium"
                leftIcon={<ArrowLeftIcon />}
                component={RouterNavLink}
                to={backLink.path}
                classes={{ link: classes.link }}
              >
                {backLink.title}
              </InlineButton>
            )
          }
          {
            hint && (
              <Box className={classes.maxWidth}>
                <FlashMessage status="warning" message={hint} viewType={ViewType.plain} hideIcon />
              </Box>
            )
          }

          {title && (
            <Typography
              className={classes.title}
              variant={titleVariant}
            >
              {title}
            </Typography>
          )}

          {children}
        </Grid>
      </Grid>

      <ModalCreateVersion
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onModalSubmit={handleModalSubmit}
      />

    </>
  );
}
