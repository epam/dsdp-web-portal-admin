import { Action } from 'redux';
import { of, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { notify } from 'reapop';
import i18n from 'localization';

import * as api from 'api/processes';
import { tryAgainNotificationErrorProps } from 'constants/errorProps';
import { catchError, getNotificationErrorProps } from '#shared/utils/apiHelpers';
import { ERROR_TYPE, ErrorInfo } from '#shared/types/common';

import {
  getProcessGroupDataError,
  getProcessGroupDataRequest,
  getProcessGroupDataSuccess,
  saveProcessGroupDataError,
  saveProcessGroupDataRequest,
  saveProcessGroupDataSuccess,
} from './slice';

export const getProcessGroupDataEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getProcessGroupDataRequest.match),
    mergeMap(({ payload: candidateVersion }) => {
      return api.getProcessGroups(candidateVersion).pipe(
        map(({ response }) => getProcessGroupDataSuccess(response)),
        catchError((serverResponse) => {
          if (serverResponse.status === 422 || serverResponse.status === 500) {
            return of(getProcessGroupDataError(i18n.t('pages~processList.error.wrongStructure')));
          }

          return of(getProcessGroupDataError(
            getNotificationErrorProps(serverResponse.response, tryAgainNotificationErrorProps()),
          ));
        }),
      );
    }),
  );
};

export const saveProcessGroupDataEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(saveProcessGroupDataRequest.match),
    mergeMap(({ payload }) => {
      return api.saveProcessGroups(payload.groupData, payload.versionId).pipe(
        mergeMap(() => of(
          saveProcessGroupDataSuccess(),
          notify(
            i18n.t('pages~processList.processGroupsTab.messages.saveSuccess'),
            'success',
          ),
        )),
        catchError((error) => {
          let errorProps: ErrorInfo = getNotificationErrorProps(error.response, tryAgainNotificationErrorProps());
          if (error.status === 422) {
            errorProps = {
              type: ERROR_TYPE.NOTIFICATION,
              message: i18n.t('pages~processList.processGroupsTab.messages.saveError'),
              componentProps: {
                title: i18n.t('pages~processList.processGroupsTab.messages.saveErrorTitle'),
              },
            };
          }

          return of(saveProcessGroupDataError(errorProps));
        }),
      );
    }),
  );
};
