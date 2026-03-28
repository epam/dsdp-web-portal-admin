import { Action } from 'redux';
import { filter, mergeMap } from 'rxjs/operators';
import { of, Observable as ActionsObservable } from 'rxjs';
import { notify } from 'reapop';
import isArray from 'lodash/isArray';

import { ERROR_TYPE } from '#shared/types/common';
import { defaultNotificationErrorProps } from 'constants/errorProps';
import { isErrorAction } from './utils';

export const handleNonCriticalErrorsEpic = (action$: ActionsObservable<Action>) => {
  return action$.pipe(
    filter(isErrorAction),
    filter(({ payload }) => {
      const errors = isArray(payload) ? payload : [payload];
      return !!errors.find((error) => error.type === ERROR_TYPE.NOTIFICATION);
    }),
    mergeMap(({ payload }) => {
      const errors = isArray(payload) ? payload : [payload];
      return of(
        ...errors
          .filter(({ type }) => type === ERROR_TYPE.NOTIFICATION)
          .map((errorInfo) => {
            const { componentProps } = defaultNotificationErrorProps();
            const message = errorInfo.message || defaultNotificationErrorProps().message;
            const title = errorInfo.componentProps?.title || componentProps.title;
            const traceId = errorInfo?.traceId;
            return notify(message, 'error', {
              title,
              traceId,
            });
          }),
      );
    }),
  );
};
