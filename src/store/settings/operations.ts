import { Action } from 'redux';
import { of, Observable } from 'rxjs';
import { notify } from 'reapop';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';

import i18n from 'localization';
import * as api from 'api/settings';
import { MASTER_VERSION_ID } from 'constants/common';
import { catchError } from '#shared/utils/apiHelpers';

import { createLocalizedNotificationProps } from 'utils/common';
import {
  getSettingsRequest,
  getSettingsError,
  getSettingsSuccess,
  updateSettingsRequest,
  updateSettingsError,
  updateSettingsSuccess,
  getMasterSupportEmailRequest,
  getMasterSupportEmailError,
  getMasterSupportEmailSuccess,
} from './slice';

export const getSettingsEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getSettingsRequest.match),
    mergeMap(({ payload }) => {
      return api.getSettings(payload).pipe(
        map(({ response }) => getSettingsSuccess(response || [])),
        catchError(({ response }) => of(getSettingsError(createLocalizedNotificationProps(response)))),
      );
    }),
  );
};

export const updateSettingsEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(updateSettingsRequest.match),
    mergeMap(({ payload: { settings, versionId } }) => {
      return api.updateSettings(settings, versionId).pipe(
        mergeMap(({ response }) => of(
          updateSettingsSuccess(response),
          notify(
            i18n.t('pages~globalSettings.notifications.success.updateSettings.message'),
            'success',
          ),
        )),
        catchError(({ response }) => of(updateSettingsError(createLocalizedNotificationProps(response)))),
      );
    }),
  );
};

export const getMasterSupportEmailEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getMasterSupportEmailRequest.match),
    mergeMap(() => {
      return api.getSettings(MASTER_VERSION_ID).pipe(
        map(({ response }) => getMasterSupportEmailSuccess(response)),
        catchError(({ response }) => of(getMasterSupportEmailError(createLocalizedNotificationProps(response)))),
      );
    }),
  );
};
