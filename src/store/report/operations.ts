import { Action } from 'redux';
import { of, Observable as ActionsObservable } from 'rxjs';
import {
  filter,
  map,
  mergeMap,
} from 'rxjs/operators';

import * as api from 'api/reports';
import { catchError } from '#shared/utils/apiHelpers';

import {
  getReportListRequest,
  getReportListError,
  getReportListSuccess,
} from './slice';

export const getReportListEpic = (
  action$: ActionsObservable<Action>,
) => {
  return action$.pipe(
    filter(getReportListRequest.match),
    mergeMap(() => {
      return api.getReportList().pipe(
        map(({ response }) => getReportListSuccess(response)),
        catchError(({ message }) => of(getReportListError({ message }))),
      );
    }),
  );
};
