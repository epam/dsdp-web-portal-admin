import { Action } from 'redux';
import { filter, map, mergeMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import i18n from 'localization';
import * as api from 'api/tables';
import { tryAgainNotificationErrorProps } from 'constants/errorProps';
import { catchError, getNotificationErrorProps } from '#shared/utils/apiHelpers';
import { ERROR_TYPE } from '#shared/types/common';
import { notify } from 'reapop';
import {
  getTableByNameError,
  getTableByNameRequest,
  getTableByNameSuccess,
  getTableListError,
  getTableListRequest,
  getTableListSuccess,
  getTableDataModelRequest,
  getTableDataModelSuccess,
  getTableDataModelError,
  updateTableDataModelRequest,
  updateTableDataModelSuccess,
  updateTableDataModelError,
} from './slice';

export const getTablesListEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getTableListRequest.match),
    mergeMap(({ payload: version }) => {
      return api.getTableList(version).pipe(
        map(({ response }) => getTableListSuccess(response)),
        catchError((serverResponse) => {
          if (serverResponse.status === 404) {
            return of(getTableListError({
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.notFound'),
            }));
          }

          if (serverResponse.status === 500) {
            return of(getTableListError({
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.server'),
            }));
          }

          return of(getTableListError(
            getNotificationErrorProps(serverResponse.response, tryAgainNotificationErrorProps()),
          ));
        }),
      );
    }),
  );
};

export const getTableByNameEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getTableByNameRequest.match),
    mergeMap(({ payload: { name, versionId } }) => {
      return api.getTableByName(versionId, name).pipe(
        map(({ response }) => getTableByNameSuccess(response)),
        catchError(({ response }) => of(
          getTableByNameError(getNotificationErrorProps(response, tryAgainNotificationErrorProps())),
        )),
      );
    }),
  );
};

export const getTableDataModelEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getTableDataModelRequest.match),
    mergeMap(({ payload: versionId }) => {
      return api.getTableDataModel(versionId).pipe(
        map(({ response }) => getTableDataModelSuccess(response)),
        catchError((serverResponse) => {
          if (serverResponse.status === 404) {
            return of(getTableDataModelError({
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.notFound'),
            }));
          }

          if (serverResponse.status === 500) {
            return of(getTableDataModelError({
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.server'),
            }));
          }

          return of(getTableDataModelError(
            getNotificationErrorProps(serverResponse.response, tryAgainNotificationErrorProps()),
          ));
        }),
      );
    }),
  );
};

export const updateTableDataModelEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(updateTableDataModelRequest.match),
    mergeMap(({ payload: { xml, versionId } }) => {
      return api.updateTableDataModel(xml, versionId).pipe(
        mergeMap(({ response }) => of(
          updateTableDataModelSuccess(response),
          notify(
            i18n.t('pages~tableList.text.currentChangesSavedSuccessfully'),
            'success',
          ),
        )),
        catchError((serverResponse) => {
          return of(updateTableDataModelError(
            getNotificationErrorProps(serverResponse.response, tryAgainNotificationErrorProps()),
          ));
        }),
      );
    }),
  );
};
