import { Action } from 'redux';
import { of, Observable as ActionsObservable } from 'rxjs';
import * as api from 'api/user';
import { API_APPENDIX, API_URL } from 'constants/baseUrl';
import { ROUTES } from 'constants/routes';
import { MASTER_VERSION_ID } from 'constants/common';
import {
  filter,
  map,
  mergeMap,
  tap,
} from 'rxjs/operators';
import { getRoutePathWithVersion } from 'utils/versions';
import { catchError } from '#shared/utils/apiHelpers';
import {
  getInfoError,
  getInfoRequest,
  getInfoSuccess,
  loginRequest,
} from './slice';

export const userLoginEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(loginRequest.match),
    tap(() => {
      // TODO: epic is not used, because strange behavior of browser, when doing navigation from epic.
      //  On localhost everything is fine
      const baseUrl = API_URL || window.location.origin;
      window.location.replace(`${baseUrl}/${API_APPENDIX}${getRoutePathWithVersion(ROUTES.HOME, MASTER_VERSION_ID)}`);
    }),
  );
};

export const getUserInfoEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getInfoRequest.match),
    mergeMap(() => {
      return api.getInfo().pipe(
        map(({ response }) => getInfoSuccess(response)),
        catchError((error) => of(getInfoError({ httpStatus: error.status }))),
      );
    }),
  );
};
