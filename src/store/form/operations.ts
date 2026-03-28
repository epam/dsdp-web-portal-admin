import { Action } from 'redux';
import { StateObservable } from 'redux-observable';
import { Observable, of } from 'rxjs';
import i18n from 'localization';
import * as api from 'api/forms';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';
import { AjaxError } from 'rxjs/ajax';

import { downloadObjectAsJson, formatFormForExport } from 'utils';
import { defaultNotificationErrorProps, tryAgainNotificationErrorProps } from 'constants/errorProps';
import type { RootState } from 'store/rootReducer';
import { FormListItem } from 'types/form';
import { ERROR_TYPE } from '#shared/types/common';
import { catchError, getNotificationErrorProps, isConflictError } from '#shared/utils/apiHelpers';
import { getRoutePathWithVersion, isMaster } from 'utils/versions';
import { notify } from 'reapop';
import { browserPush as push } from 'utils/common';
import { ROUTES } from 'constants/routes';
import { selectFormETags, selectFormList } from './selectors';
import {
  getFormListRequest,
  getFormListError,
  getFormListSuccess,
  createFormRequest,
  createFormError,
  createFormSuccess,
  exportFormRequest,
  exportFormSuccess,
  exportFormError,
  getFormByNameRequest,
  getFormByNameSuccess,
  getFormByNameError,
  updateFormRequest,
  updateFormSuccess,
  updateFormError,
  deleteFormRequest,
  deleteFormSuccess,
  deleteFormError,
  setHasConflicts,
  setFormETags,
} from './slice';

const getFormErroInfo = (hasErrorInfo: boolean, traceId?: string) => {
  if (hasErrorInfo) {
    return {
      type: ERROR_TYPE.NOTIFICATION,
      message: i18n.t('domains~form.notifications.error.uniqueName.message'),
      componentProps: {
        title: i18n.t('domains~form.notifications.error.uniqueName.title'),
      },
      traceId,
    };
  }
  return {
    type: ERROR_TYPE.NOTIFICATION,
    traceId,
  };
};

export const getFormListEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getFormListRequest.match),
    mergeMap(({ payload: formVersion }) => {
      return api.getFormList(formVersion).pipe(
        mergeMap(({ response }: { response: FormListItem[] }) => {
          const eTagsEntries = response.filter((item) => item.ETag).map((item) => ([item.name, item.ETag]));
          const eTagsMap = Object.fromEntries(eTagsEntries);
          return of(
            getFormListSuccess(response),
            setFormETags(eTagsEntries.length ? eTagsMap : null),
          );
        }),
        // TODO add notification error
        catchError(({ message }) => of(getFormListError({ message }))),
      );
    }),
  );
};

export const createFormEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(createFormRequest.match),
    mergeMap(({ payload }) => {
      const { versionId, data } = payload;

      return api.createForm(data, versionId).pipe(
        mergeMap(({ response }) => {
          if (isMaster(versionId)) {
            return of(
              createFormSuccess(),
              setHasConflicts(false),
            );
          }
          return of(
            createFormSuccess(),
            notify(
              i18n.t('domains~form.notifications.success.createForm.message', { title: response.title }),
              'success',
            ),
            push(getRoutePathWithVersion(ROUTES.EDIT_FORM, versionId).replace(':formId', data.name)),
          );
        }),
        catchError((response) => {
          if (isConflictError(response)) {
            return of(createFormError(
              {
                type: ERROR_TYPE.NOTIFICATION,
                message: i18n.t('pages~createForm.notifications.error.conflict.message'),
                componentProps: {
                  title: i18n.t('pages~createForm.notifications.error.conflict.title'),
                },
              },
            ));
          }
          const { response: errorResponse } = response;
          return of(createFormError(
            getFormErroInfo(errorResponse?.messageKey, errorResponse?.traceId),
          ));
        }),
      );
    }),
  );
};

export const exportFormEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(exportFormRequest.match),
    mergeMap(({ payload }) => {
      return api.getFormByName(payload.name, payload.versionId).pipe(
        map(({ response }) => {
          try {
            downloadObjectAsJson(formatFormForExport(response), response.name as string);
            return exportFormSuccess();
          } catch (error) {
            return exportFormError(error as AjaxError);
          }
        }),
        catchError(() => of(exportFormError(defaultNotificationErrorProps()))),
      );
    }),
  );
};

export const getFormByNameEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getFormByNameRequest.match),
    mergeMap(({ payload }) => {
      return api.getFormByName(payload.name, payload.versionId).pipe(
        mergeMap(({ response, xhr }) => {
          const eTagHeader = xhr.getResponseHeader('ETag');
          return of(
            getFormByNameSuccess(response),
            setFormETags(eTagHeader ? { [payload.name]: eTagHeader } : null),
          );
        }),
        catchError(({ message }) => of(getFormByNameError({ message }))),
      );
    }),
  );
};

export const updateFormEpic = (
  action$: Observable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(updateFormRequest.match),
    mergeMap(({ payload }) => {
      const { versionId, data } = payload;
      const eTags = selectFormETags(state$.value);
      const formETag = eTags ? eTags[data.name] : undefined;
      return api.updateForm(data, versionId, formETag).pipe(
        mergeMap(({ xhr }) => {
          const eTagHeader = xhr.getResponseHeader('ETag');
          const actions = [
            updateFormSuccess(),
            setFormETags(eTagHeader ? { [data.name]: eTagHeader } : null),
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
              i18n.t('domains~form.notifications.success.updateForm.message'),
              'success',
            ) as never,
          );
        }),
        catchError((response) => {
          if (isConflictError(response)) {
            return of(
              updateFormError(response),
              setHasConflicts(true),
            );
          }
          const { response: errorResponse } = response;
          return of(updateFormError(getFormErroInfo(errorResponse?.messageKey, errorResponse?.traceId)));
        }),
      );
    }),
  );
};

export const deleteFormEpic = (
  action$: Observable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(deleteFormRequest.match),
    mergeMap(({ payload }) => {
      const eTags = selectFormETags(state$.value);
      const formETag = eTags ? eTags[payload.name] : undefined;
      return api.deleteForm(payload.name, payload.versionId, formETag).pipe(
        mergeMap(() => {
          if (isMaster(payload.versionId)) {
            return of(
              deleteFormSuccess(payload.versionId),
              setHasConflicts(false),
            );
          }
          return of(
            deleteFormSuccess(payload.versionId),
            notify(
              i18n.t('domains~form.notifications.success.deleteForm.message', { title: payload.title }),
              'success',
            ),
            push(getRoutePathWithVersion(ROUTES.HOME, payload.versionId)),
          );
        }),
        catchError((response) => {
          if (isConflictError(response)) {
            return of(
              deleteFormError(response),
              setHasConflicts(true),
            );
          }
          const { response: errorResponse } = response;
          return of(deleteFormError(getNotificationErrorProps(errorResponse, tryAgainNotificationErrorProps())));
        }),
      );
    }),
  );
};

export const refreshFormListEpic = (
  action$: Observable<Action>,
  state$: StateObservable<RootState>,
) => {
  return action$.pipe(
    filter(deleteFormSuccess.match),
    filter(() => !!selectFormList(state$.value).length),
    filter(({ payload }) => isMaster(payload)),
    map(({ payload }) => {
      return getFormListRequest(payload);
    }),
  );
};
