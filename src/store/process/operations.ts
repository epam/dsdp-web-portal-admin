import { Action } from 'redux';
import { StateObservable } from 'redux-observable';
import { of, Observable as ActionsObservable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import * as api from 'api/processes';
import { tryAgainNotificationErrorProps } from 'constants/errorProps';
import { RootState } from 'store/rootReducer';
import { ERROR_TYPE } from '#shared/types/common';
import {
  catchError, getNotificationErrorProps, isConflictError, isValidationError,
} from '#shared/utils/apiHelpers';
import { notify } from 'reapop';
import i18n from 'localization';
import { getRoutePathWithVersion, isMaster } from 'utils/versions';
import { browserPush as push, createLocalizedNotificationProps } from 'utils/common';
import { ROUTES } from 'constants/routes';
import {
  getProcessByNameRequest,
  getProcessListError,
  getProcessListRequest,
  getProcessListSuccess,
  getProcessByNameError,
  getProcessByNameSuccess,
  updateProcessRequest,
  updateProcessSuccess,
  updateProcessError,
  createProcessRequest,
  createProcessSuccess,
  createProcessError,
  deleteProcessRequest,
  deleteProcessSuccess,
  deleteProcessError,
  setProcessHasConflicts,
  setProcessETags,
} from './slice';
import { selectProcessETags, selectProcessList } from './selectors';

export const getProcessListEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getProcessListRequest.match),
    mergeMap(({ payload: formVersion }) => {
      return api.getProcessList(formVersion).pipe(
        mergeMap(({ response }) => {
          const eTagsEntries = response.filter((item) => item.ETag).map((item) => ([item.name, item.ETag]));
          const eTagsMap = Object.fromEntries(eTagsEntries);
          return of(
            getProcessListSuccess(response),
            setProcessETags(eTagsEntries.length ? eTagsMap : null),
          );
        }),
        catchError(({ response }) => of(
          getProcessListError(getNotificationErrorProps(response, tryAgainNotificationErrorProps())),
        )),
      );
    }),
  );
};

export const getProcessByNameEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getProcessByNameRequest.match),
    mergeMap(({ payload }) => {
      return api.getProcessByName(payload.name, payload.versionId).pipe(
        mergeMap(({ response, xhr }) => {
          const eTagHeader = xhr.getResponseHeader('ETag');
          return of(
            getProcessByNameSuccess(response),
            setProcessETags(eTagHeader ? { [payload.name]: eTagHeader } : null),
          );
        }),
        catchError(({ response }) => of(
          getProcessByNameError(getNotificationErrorProps(response, tryAgainNotificationErrorProps())),
        )),
      );
    }),
  );
};

export const updateProcessEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(updateProcessRequest.match),
    mergeMap(({
      payload: {
        name, data, versionId, title,
      },
    }) => {
      const eTags = selectProcessETags(state$.value);
      const processETag = eTags ? eTags[name] : undefined;
      return api.updateProcess(name, data, versionId, processETag).pipe(
        mergeMap(({ xhr }) => {
          const eTagHeader = xhr.getResponseHeader('ETag');
          const actions = [
            updateProcessSuccess(),
            setProcessETags(eTagHeader ? { [name]: eTagHeader } : null),
          ];
          if (isMaster(versionId)) {
            return of(
              ...actions,
              setProcessHasConflicts(false) as never,
            );
          }
          return of(
            ...actions,
            notify(
              i18n.t('domains~process.notifications.success.updateProcess.message', { title }),
              'success',
            ) as never,
          );
        }),
        catchError((response) => {
          if (isValidationError(response)) {
            return of(
              updateProcessError({
                type: ERROR_TYPE.NOTIFICATION,
                message: i18n.t('errors~form.invalidForm'),
              }),
            );
          }
          if (isConflictError(response)) {
            return of(
              updateProcessError(response),
              setProcessHasConflicts(true),
            );
          }
          const { response: errorResponse } = response;
          return of(updateProcessError(
            errorResponse?.messageKey
              ? createLocalizedNotificationProps(errorResponse)
              : getNotificationErrorProps(errorResponse, tryAgainNotificationErrorProps()),
          ));
        }),
      );
    }),
  );
};

export const createProcessEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(createProcessRequest.match),
    mergeMap(({
      payload: {
        data, versionId, name, title,
      },
    }) => {
      return api.createProcess(name, data, versionId).pipe(
        mergeMap(() => {
          if (isMaster(versionId)) {
            return of(
              createProcessSuccess(),
              setProcessHasConflicts(false),
            );
          }
          return of(
            createProcessSuccess(),
            notify(
              i18n.t('domains~process.notifications.success.createProcess.message', { title }),
              'success',
            ),
            push(getRoutePathWithVersion(ROUTES.EDIT_PROCESS, versionId).replace(':processName', name)),
          );
        }),
        catchError((response) => {
          if (isValidationError(response)) {
            return of(
              createProcessError({
                type: ERROR_TYPE.NOTIFICATION,
                message: i18n.t('errors~form.invalidForm'),
              }),
            );
          }
          const { response: errorResponse } = response;
          return of(createProcessError(
            errorResponse?.messageKey
              ? createLocalizedNotificationProps(errorResponse)
              : getNotificationErrorProps(errorResponse, tryAgainNotificationErrorProps()),
          ));
        }),
      );
    }),
  );
};
export const deleteProcessEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(deleteProcessRequest.match),
    mergeMap(({
      payload: {
        versionId, name, title,
      },
    }) => {
      const eTags = selectProcessETags(state$.value);
      const processETag = eTags ? eTags[name] : undefined;
      return api.deleteProcess(name, versionId, processETag).pipe(
        mergeMap(() => {
          if (isMaster(versionId)) {
            return of(
              deleteProcessSuccess(versionId),
              setProcessHasConflicts(false),
            );
          }
          return of(
            deleteProcessSuccess(versionId),
            notify(
              i18n.t('domains~process.notifications.success.deleteProcess.message', { title }),
              'success',
            ),
            push(getRoutePathWithVersion(ROUTES.HOME, versionId)),
          );
        }),
        catchError((response) => {
          if (isConflictError(response)) {
            return of(
              deleteProcessError(response),
              setProcessHasConflicts(true),
            );
          }
          const { response: errorResponse } = response;
          return of(
            deleteProcessError(getNotificationErrorProps(errorResponse, tryAgainNotificationErrorProps())),
          );
        }),
      );
    }),
  );
};

export const refreshProcessListEpic = (
  action$: ActionsObservable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(deleteProcessSuccess.match),
    filter(() => !!selectProcessList(state$.value).length),
    filter(({ payload }) => isMaster(payload)),
    map(({ payload }) => {
      return getProcessListRequest(payload);
    }),
  );
};
