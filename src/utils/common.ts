import { ERROR_TYPE, ErrorInfo, ErrorResponse } from '#shared/types/common';
import { customNavigate } from '#shared/utils/common';
import i18n from 'localization';
import { history } from 'store/history';

export const createLocalizedNotificationProps = (errorResponse: ErrorResponse): ErrorInfo => {
  return {
    type: ERROR_TYPE.NOTIFICATION,
    ...(errorResponse?.traceId && { traceId: errorResponse?.traceId }),
    ...(errorResponse?.messageKey && {
      message: i18n.t(`serverMessages~${errorResponse.messageKey}`, errorResponse.messageParameters),
    }),
  };
};

export const BROWSER_PUSH_ACTION_TYPE = 'BROWSER_HISTORY_ROUTER_PUSH';

export function browserPush(...params: Parameters<typeof history.push>) {
  customNavigate(...params);
  return { type: BROWSER_PUSH_ACTION_TYPE, payload: { path: params[0], ...(params[1] && { state: params[1] }) } };
}
