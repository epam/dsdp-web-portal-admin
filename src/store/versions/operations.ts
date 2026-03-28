import { Action } from 'redux';
import { of, Observable as ActionsObservable } from 'rxjs';
import { notify } from 'reapop';

import * as api from 'api/versions';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';
import { getRoutePathWithVersion } from 'utils/versions';
import { ROUTES } from 'constants/routes';
import { MASTER_VERSION_ID } from 'constants/common';
import i18n from 'localization';
import { ERROR_TYPE } from '#shared/types/common';
import { catchError } from '#shared/utils/apiHelpers';

import { createLocalizedNotificationProps, browserPush as push } from 'utils/common';
import {
  getVersionsListRequest,
  getVersionsListError,
  getVersionsListSuccess,
  createVersionRequest,
  createVersionError,
  createVersionSuccess,
  getMasterRequest,
  getMasterSuccess,
  getMasterError,
  getCandidateRequest,
  getCandidateError,
  getCandidateSuccess,
  mergeCandidateRequest,
  mergeCandidateError,
  mergeCandidateSuccess,
  abandonCandidateRequest,
  abandonCandidateError,
  abandonCandidateSuccess,
  getCandidateChangesRequest,
  getCandidateChangesError,
  getCandidateChangesSuccess,
  rebaseCandidateRequest,
  rebaseCandidateSuccess,
  rebaseCandidateError,
  revertChangeRequest,
  revertChangeSuccess,
  revertChangeError,
} from './slice';

export const getVersionsListEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getVersionsListRequest.match),
    mergeMap(() => {
      return api.getVersionsList().pipe(
        map(({ response }) => getVersionsListSuccess(response || [])),
        catchError(({ response }) => of(getVersionsListError(createLocalizedNotificationProps(response)))),
      );
    }),
  );
};

export const createVersionEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(createVersionRequest.match),
    mergeMap(({ payload }) => {
      const {
        data, path, state, nextAction,
      } = payload;
      return api.createVersion(data).pipe(
        mergeMap(({ response }) => {
          const actions = [
            createVersionSuccess(),
            getVersionsListRequest(),
          ];
          if (path) {
            actions.push(
              push(getRoutePathWithVersion(path, response.id), { state }) as never,
            );
          }
          if (nextAction) {
            actions.push(nextAction(response.id) as never);
          }
          return of(...actions);
        }),
        catchError(({ response }) => {
          return of(createVersionError(
            {
              traceId: response?.traceId,
              type: ERROR_TYPE.NOTIFICATION,
            },
          ));
        }),
      );
    }),
  );
};

export const getMasterEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getMasterRequest.match),
    mergeMap(() => {
      return api.getMaster().pipe(
        map(({ response }) => getMasterSuccess(response)),
        catchError(({ response }) => of(getMasterError(
          {
            traceId: response?.traceId,
            type: ERROR_TYPE.NOTIFICATION,
          },
        ))),
      );
    }),
  );
};

export const getCandidateEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getCandidateRequest.match),
    mergeMap(({ payload: versionId }) => {
      return api.getCandidate(versionId).pipe(
        map(({ response }) => getCandidateSuccess(response)),
        catchError(({ response }) => of(getCandidateError(
          {
            traceId: response?.traceId,
            type: ERROR_TYPE.NOTIFICATION,
          },
        ))),
      );
    }),
  );
};

export const mergeCandidateEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(mergeCandidateRequest.match),
    mergeMap(({ payload: versionId }) => {
      return api.mergeCandidate(versionId).pipe(
        mergeMap(() => of(
          mergeCandidateSuccess(),
          push(getRoutePathWithVersion(ROUTES.HOME, MASTER_VERSION_ID)),
        )),
        catchError(({ response }) => of(mergeCandidateError(
          {
            traceId: response?.traceId,
            type: ERROR_TYPE.NOTIFICATION,
          },
        ))),
      );
    }),
  );
};

export const rebaseCandidateEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(rebaseCandidateRequest.match),
    mergeMap(({ payload: versionId }) => {
      return api.rebaseCandidate(versionId).pipe(
        mergeMap(() => of(
          rebaseCandidateSuccess(),
          getCandidateRequest(versionId),
          getCandidateChangesRequest(versionId),
        )),
        catchError(({ response }) => of(rebaseCandidateError(
          {
            traceId: response?.traceId,
            type: ERROR_TYPE.NOTIFICATION,
          },
        ))),
      );
    }),
  );
};

export const abandonCandidateEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(abandonCandidateRequest.match),
    mergeMap(({ payload: versionId }) => {
      return api.abandonCandidate(versionId).pipe(
        map(() => abandonCandidateSuccess()),
        mergeMap(() => of(
          abandonCandidateSuccess(),
          push(getRoutePathWithVersion(ROUTES.HOME, MASTER_VERSION_ID)),
        )),
        catchError(({ response }) => of(abandonCandidateError(
          {
            traceId: response?.traceId,
            type: ERROR_TYPE.NOTIFICATION,
          },
        ))),
      );
    }),
  );
};

export const getCandidateChangesEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getCandidateChangesRequest.match),
    mergeMap(({ payload: versionId }) => {
      return api.getCandidateChanges(versionId).pipe(
        map(({ response }) => getCandidateChangesSuccess(response)),
        catchError(({ response }) => of(getCandidateChangesError(
          {
            traceId: response?.traceId,
            type: ERROR_TYPE.NOTIFICATION,
          },
        ))),
      );
    }),
  );
};

export const revertChangeEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(revertChangeRequest.match),
    mergeMap(({ payload: { versionId, changeItem, changeType } }) => {
      return api.revertChange(versionId, changeType, changeItem).pipe(
        mergeMap(() => of(
          notify(
            i18n.t('components~candidateChanges.notifications.revertSuccessful', { name: changeItem.name }),
            'success',
          ),
          revertChangeSuccess(),
          getCandidateRequest(versionId),
          getCandidateChangesRequest(versionId),
        )),
        catchError(({ response }) => of(revertChangeError(
          {
            traceId: response?.traceId,
            type: ERROR_TYPE.NOTIFICATION,
          },
        ))),
      );
    }),
  );
};
