import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { ErrorInfo } from '#shared/types/common';
import { selectorAsyncActionCriticalErrors } from 'store/asyncAction/selectors';
import Loader from 'components/Loader';
import LogoIcon from 'components/LogoImage';
import StandardLayoutCommon from '#web-components/components/Layouts/Standard';
import LogoLink from '#web-components/components/Navbar/components/LogoLink';
import { getRegistryTitle, getRegistryTitleFull } from '#shared/utils/registrySettings';

import LanguageSwitcher from '#web-components/components/LanguageSwitcher';
import useAuthentication from 'hooks/useAuthentication';
import ErrorLayout from '../Error';

interface Props {
  children?: React.ReactNode;
  title: string;
  description?: string;
  isLoading?: boolean;
  error?: ErrorInfo;
}

export default function StandardLayout({
  title,
  description,
  error,
  isLoading = false,
  children,
}: Props) {
  const { t, i18n } = useTranslation('common');
  const criticalError = useSelector(selectorAsyncActionCriticalErrors);
  const registryTitle = getRegistryTitle(REGISTRY_SETTINGS, i18n);
  const registryTitleFull = getRegistryTitleFull(REGISTRY_SETTINGS, i18n);
  const languageList = ENVIRONMENT_VARIABLES.supportedLanguages;
  const authentication = useAuthentication();

  const handleChangeLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
  }, [i18n]);

  if (criticalError || error) {
    return (
      <ErrorLayout
        error={criticalError || error}
      />
    );
  }

  return (
    <StandardLayoutCommon
      title={title}
      registryName={registryTitle}
      registryFullName={registryTitleFull}
      description={description}
      loader={<Loader show={isLoading} />}
      showNavigation={authentication?.authenticated}
      sidebar={{
        logo: <LogoLink
          appTitle={t('text~appTitle')}
          homePath="/"
          navLinkComponent={RouterLink}
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
      {children}
    </StandardLayoutCommon>
  );
}
