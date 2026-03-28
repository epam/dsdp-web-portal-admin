import i18n from 'localization';
import { ERROR_TYPE } from '#shared/types/common';
import { ROUTES } from './routes';

export const notFoundErrorProps = () => ({
  message: i18n.t('errors~notFound.message'),
  componentProps: {
    title: '404',
    description: i18n.t('errors~notFound.description'),
  },
});

export const defaultCriticalErrorProps = () => ({
  type: ERROR_TYPE.CRITICAL,
  componentProps: {
    hasRefreshBtn: true,
  },
});

export const defaultNotificationErrorProps = () => ({
  message: i18n.t('errors~notification.default.message'),
  type: ERROR_TYPE.NOTIFICATION,
  componentProps: {
    title: i18n.t('errors~notification.default.title'),
  },
});

export const tryAgainNotificationErrorProps = () => ({
  type: ERROR_TYPE.NOTIFICATION,
  message: i18n.t('errors~notification.tryAgain.message'),
  componentProps: {
    title: i18n.t('errors~notification.default.title'),
  },
});

export const rateLimitCriticalErrorProps = () => ({
  type: ERROR_TYPE.CRITICAL,
  componentProps: {
    description: i18n.t('errors~rateLimit.description'),
    hasRefreshBtn: true,
    hideNavigation: true,
  },
});

export const forbiddenErrorProps = () => ({
  message: i18n.t('errors~forbidden.message'),
  isSystemError: true,
  componentProps: {
    title: '403',
    description: i18n.t('errors~forbidden.description'),
    backLinkTitle: i18n.t('errors~forbidden.backToStart'),
    backLink: `${ROUTES.LOGIN}?logout`,
  },
});
