import { Action } from 'redux';
import { browserPush as push, createLocalizedNotificationProps } from 'utils/common';
import { of, Observable as ActionsObservable } from 'rxjs';
import * as api from 'api/users';
import { ROUTES } from 'constants/routes';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';
import { getRoutePathWithVersion } from 'utils/versions';
import { ERROR_TYPE } from '#shared/types/common';
import { catchError } from '#shared/utils/apiHelpers';

import i18n from 'localization';
import {
  getImportInfoRequest,
  getImportInfoError,
  getImportInfoSuccess,

  sendImportFileRequest,
  sendImportFileError,
  sendImportFileSuccess,

  startImportRequest,
  startImportError,
  startImportSuccess,

  deleteImportFileRequest,
  deleteImportFileError,
  deleteImportFileSuccess,
} from './slice';

export const getImportInfoEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getImportInfoRequest.match),
    mergeMap(() => {
      return api.getImportInfo().pipe(
        map(({ response }) => getImportInfoSuccess(response)),
        catchError(({ response }) => of(getImportInfoError(createLocalizedNotificationProps(response)))),
      );
    }),
  );
};

export const sendImportFileEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(sendImportFileRequest.match),
    mergeMap(({ payload }) => {
      return api.sendImportFile(payload).pipe(
        map(({ response }) => sendImportFileSuccess(response)),
        catchError(({ response }) => of(sendImportFileError(
          response?.messageKey
            ? { message: i18n.t(`serverMessages~${response.messageKey}`, response.messageParameters) }
            : { type: ERROR_TYPE.NOTIFICATION, traceId: response?.traceId },
        ))),
      );
    }),
  );
};

export const startImportEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(startImportRequest.match),
    mergeMap(({ payload }) => {
      const { versionId } = payload;

      return api.startImport().pipe(
        mergeMap(() => of(
          startImportSuccess(),
          push(getRoutePathWithVersion(ROUTES.IMPORT_USERS_SUCCESS, versionId)),
        )),
        catchError(({ response }) => of(startImportError(createLocalizedNotificationProps(response)))),
      );
    }),
  );
};

export const deleteImportFileEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(deleteImportFileRequest.match),
    mergeMap(({ payload }) => {
      return api.deleteImportFile(payload).pipe(
        map(() => deleteImportFileSuccess()),
        catchError(({ response }) => of(deleteImportFileError(createLocalizedNotificationProps(response)))),
      );
    }),
  );
};
