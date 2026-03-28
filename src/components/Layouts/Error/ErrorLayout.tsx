import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import Typography from '#web-components/components/Typography';
import LogoLink from '#web-components/components/Navbar/components/LogoLink';
import Button from '#web-components/components/Button';

import useVersion from 'hooks/useVersion';
import { getRoutePathWithVersion } from 'utils/versions';
import { ROUTES } from 'constants/routes';
import LogoIcon from 'components/LogoImage';
import { rateLimitCriticalErrorProps } from 'constants/errorProps';
import StandardLayoutCommon from '#web-components/components/Layouts/Standard';
import { ErrorInfo } from '#shared/types/common';
import LanguageSwitcher from '#web-components/components/LanguageSwitcher';
import { getRegistryTitle, getRegistryTitleFull } from '#shared/utils/registrySettings';
import useAuthentication from 'hooks/useAuthentication';
import { useNavigate } from 'react-router';
import ErrorNavLink from '../../ErrorBoundary/components';

import styles from './ErrorLayout.styles';

const useStyles = makeStyles(styles, { name: 'ErrorLayout' });

type ErrorLayoutProps = {
  error: ErrorInfo
};

export default function ErrorLayout({ error: errorProps }: ErrorLayoutProps) {
  const { t, i18n } = useTranslation('components', { keyPrefix: 'errorLayout' });
  const classes = useStyles();
  const navigate = useNavigate();
  const { versionId } = useVersion();
  const registryTitle = getRegistryTitle(REGISTRY_SETTINGS, i18n);
  const registryTitleFull = getRegistryTitleFull(REGISTRY_SETTINGS, i18n);
  const languageList = ENVIRONMENT_VARIABLES.supportedLanguages;
  const authentication = useAuthentication();

  const handleChangeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
  }, [i18n]);

  const handleBackLinkClick = useCallback(() => {
    navigate(getRoutePathWithVersion(ROUTES.HOME, versionId));
  }, [navigate, versionId]);

  let error = errorProps;

  if (error.httpStatus === 429) {
    error = rateLimitCriticalErrorProps();
  }

  return (
    <StandardLayoutCommon
      title=""
      description=""
      registryName={registryTitle}
      registryFullName={registryTitleFull}
      showNavigation={authentication?.authenticated}
      sidebar={{
        logo: <LogoLink
          appTitle={i18n.t('text~appTitle')}
          homePath="/"
          navLinkComponent={ErrorNavLink}
          logoIcon={<LogoIcon />}
        />,
      }}
      topbar={(
        languageList.length && (
          <LanguageSwitcher
            language={i18n.language}
            languageList={languageList}
            onChange={handleChangeLanguage}
          />
        )
      )}
    >
      <Typography variant="h1" className={classes.title}>
        {error.componentProps?.title || t('text.errorTitle')}
      </Typography>
      <div className={classes.fixedWidthContent}>
        <Typography variant="h3" className={classes.message}>
          {error.message || t('text.smthWentWrong')}
        </Typography>
        <Typography variant="textRegular" className={classes.description}>
          {error.componentProps?.description || t('text.reloadPageAndContactAdministrator')}
        </Typography>

        <Button onClick={handleBackLinkClick} className={classes.button} size="large">
          <Typography variant="h7" component="span">
            {error.componentProps?.backLinkTitle || t('text.backToHome')}
          </Typography>
        </Button>
      </div>
    </StandardLayoutCommon>
  );
}
