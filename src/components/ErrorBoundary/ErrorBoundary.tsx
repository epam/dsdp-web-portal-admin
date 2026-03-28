import React from 'react';
import { WithTranslation } from 'react-i18next';
import { defaultCriticalErrorProps } from 'constants/errorProps';
import { getRegistryTitle, getRegistryTitleFull } from '#shared/utils/registrySettings';
import ErrorLayoutCommon from '#web-components/components/Layouts/Error';
import LogoIcon from 'components/LogoImage';
import ErrorNavLink from './components';

type ErrorBoundaryProps = WithTranslation;

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // eslint-disable-next-line class-methods-use-this
  handleBackLinkClick = (path?: string) => {
    window.location.assign(path || '/');
  };

  render() {
    const { hasError } = this.state;
    const { children, t, i18n } = this.props;
    const registryTitle = getRegistryTitle(REGISTRY_SETTINGS, i18n);
    const registryTitleFull = getRegistryTitleFull(REGISTRY_SETTINGS, i18n);

    if (hasError) {
      return (
        <ErrorLayoutCommon
          registryName={registryTitle}
          registryFullName={registryTitleFull}
          error={defaultCriticalErrorProps()}
          reloadButtonCaption={t('errorLayout.text.reloadPage')}
          defaultErrorTitle={t('errorLayout.text.errorTitle')}
          defaultBackLinkTitle={t('errorLayout.text.backToHome')}
          defaultMessage={t('errorLayout.text.smthWentWrong')}
          defaultDescription={t('errorLayout.text.reloadPageAndContactAdministrator')}
          homePath="/"
          navLinkComponent={ErrorNavLink}
          appTitle={t('text~appTitle')}
          onBackLinkClick={this.handleBackLinkClick}
          logoIcon={<LogoIcon />}
        />
      );
    }
    return children;
  }
}
