import { Action } from 'redux';
import { StateObservable } from 'redux-observable';
import { of, OperatorFunction, Observable as ActionsObservable } from 'rxjs';
import { PayloadAction } from '@reduxjs/toolkit';
import * as api from 'api/i18n';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';

import { getLanguageNativeName } from 'utils/i18n';
import { catchError, isConflictError } from '#shared/utils/apiHelpers';

import { notify } from 'reapop';

import { createLocalizedNotificationProps, browserPush as push } from 'utils/common';
import { getRoutePathWithVersion, isMaster } from 'utils/versions';
import i18n from 'localization';
import { ROUTES } from 'constants/routes';
import { ErrorInfo, ErrorResponse } from '#shared/types/common';
import {
  createI18nError,
  createI18nRequest,
  createI18nSuccess,
  deleteI18nError,
  deleteI18nRequest,
  deleteI18nSuccess,
  getI18nByNameError,
  getI18nByNameRequest,
  getI18nListError,
  getI18nListRequest,
  getI18nListSuccess,
  getI18nByNameSuccess,
  setHasConflicts,
  setI18nETags,
  updateI18nError,
  updateI18nRequest,
  updateI18nSuccess,
} from './slice';
import type { RootState } from '../rootReducer';
import { selectI18nETags } from './selectors';

const getI18nError = (errorResponse: ErrorResponse): ErrorInfo => {
  if (errorResponse.messageParameters?.bundleName) {
    return createLocalizedNotificationProps({
      ...errorResponse,
      messageParameters: {
        bundleName: getLanguageNativeName(errorResponse.messageParameters.bundleName),
      },
    });
  }
  return createLocalizedNotificationProps(errorResponse);
};

export const getI18nListEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getI18nListRequest.match),
    mergeMap(({ payload: i18nVersion }) => {
      return api.getI18nList(i18nVersion).pipe(
        mergeMap(({ response }) => {
          const eTagsEntries = response.filter((item) => item.eTag).map((item) => ([item.name, item.eTag]));
          const eTagsMap = Object.fromEntries(eTagsEntries);
          return of(
            getI18nListSuccess(response),
            setI18nETags(eTagsEntries.length ? eTagsMap : null),
          );
        }),
        catchError(({ response }) => of(getI18nListError(getI18nError(response)))),
      );
    }),
  );
};

export const getI18nByNameEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getI18nByNameRequest.match),
    mergeMap(({ payload }) => {
      return api.getI18nByName(payload.name, payload.versionId).pipe(
        mergeMap(({ response, xhr }) => {
          const eTagHeader = xhr.getResponseHeader('ETag');
          return of(
            getI18nByNameSuccess(JSON.stringify(response, null, 4)),
            setI18nETags(eTagHeader ? { [payload.name]: eTagHeader } : null),
          );
        }),
        catchError(({ response }) => of(getI18nByNameError(getI18nError(response)))),
      );
    }),
  );
};

export const createI18nEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(createI18nRequest.match),
    mergeMap(({ payload }) => {
      const { name, versionId, i18nContent } = payload;

      return api.createI18n(name, versionId, i18nContent).pipe(
        mergeMap(() => {
          if (isMaster(versionId)) {
            return of(
              createI18nSuccess(versionId),
              setHasConflicts(false),
            );
          }
          return of(
            createI18nSuccess(versionId),
            notify(
              i18n.t('domains~i18n.notifications.success.createI18n.message', { title: getLanguageNativeName(name) }),
              'success',
            ),
          );
        }),
        catchError(({ response }) => {
          return of(createI18nError(getI18nError(response)));
        }),
      );
    }),
  );
};

export const updateI18nEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(updateI18nRequest.match),
    mergeMap(({ payload }) => {
      const { versionId, name, i18nContent } = payload;
      const eTags = selectI18nETags(state$.value);
      const i18nETag = eTags ? eTags[name] : undefined;
      return api.updateI18n(name, versionId, i18nContent, i18nETag).pipe(
        mergeMap(({ xhr }) => {
          const eTagHeader = xhr.getResponseHeader('ETag');
          const actions = [
            updateI18nSuccess(versionId),
            setI18nETags(eTagHeader ? { [name]: eTagHeader } : null),
          ];
          if (isMaster(versionId)) {
            return of(
              ...actions,
              setHasConflicts(false) as never,
            );
          }
          return of(
            ...actions,
            notify(
              i18n.t('domains~i18n.notifications.success.updateI18n.message'),
              'success',
            ) as never,
          );
        }),
        catchError((response) => {
          if (isConflictError(response)) {
            return of(
              updateI18nError(response),
              setHasConflicts(true),
            );
          }
          const { response: errorResponse } = response;
          return of(updateI18nError(getI18nError(errorResponse)));
        }),
      );
    }),
  );
};

export const deleteI18nEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(deleteI18nRequest.match),
    mergeMap(({ payload }) => {
      const eTags = selectI18nETags(state$.value);
      const i18nETag = eTags ? eTags[payload.name] : undefined;
      return api.deleteI18n(payload.name, payload.versionId, i18nETag).pipe(
        mergeMap(() => {
          if (isMaster(payload.versionId)) {
            return of(
              deleteI18nSuccess(payload.versionId),
              setHasConflicts(false),
            );
          }
          return of(
            deleteI18nSuccess(payload.versionId),
            notify(
              i18n.t('domains~i18n.notifications.success.deleteI18n.message', {
                title: getLanguageNativeName(payload.name),
              }),
              'success',
            ),
            push(getRoutePathWithVersion(ROUTES.HOME, payload.versionId)),
          );
        }),
        catchError((response) => {
          if (isConflictError(response)) {
            return of(
              deleteI18nError(response),
              setHasConflicts(true),
            );
          }
          const { response: errorResponse } = response;
          return of(deleteI18nError(getI18nError(errorResponse)));
        }),
      );
    }),
  );
};

export const refreshI18nListEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter((action) => {
      return deleteI18nSuccess.match(action) || createI18nSuccess.match(action) || updateI18nSuccess.match(action);
    }) as OperatorFunction<Action, PayloadAction<string>>,
    map(({ payload }) => {
      return getI18nListRequest(payload);
    }),
  );
};
