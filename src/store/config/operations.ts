import { Action } from 'redux';
import { Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { catchError } from '#shared/utils/apiHelpers';
import { ERROR_TYPE } from '#shared/types/common';
import * as api from 'api/config';
import { AjaxResponse } from 'rxjs/internal/observable/dom/AjaxObservable';
import {
  getBpModelerTemplatesError,
  getBpModelerTemplatesRequest,
  getBpModelerTemplatesSuccess,
} from './slice';

export const getBpModelerTemplatesEpic = (
  action$: Observable<Action>,
) => {
  return action$.pipe(
    filter(getBpModelerTemplatesRequest.match),
    mergeMap(() => {
      return api.getBpModelerTemplates().pipe(
        map((ajaxResponse) => {
          const { response } = ajaxResponse as AjaxResponse;
          return getBpModelerTemplatesSuccess(response);
        }),
        catchError(() => of(getBpModelerTemplatesError({
          type: ERROR_TYPE.NOTIFICATION,
        }))),
      );
    }),
  );
};
