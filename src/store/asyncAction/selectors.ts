import { createSelector } from '@reduxjs/toolkit';
import get from 'lodash/get';

import { RootState } from 'store/rootReducer';
import { ERROR_TYPE, ErrorInfo } from '#shared/types/common';
import { requestActionPostfix } from './constants';
import { getActionName } from './utils';

export const selectAsyncActionState = (state: RootState) => state.asyncAction;
export const selectAsyncActionMap = createSelector(selectAsyncActionState, (state) => state.asyncActionMap);

export const createAsyncActionSelector = (requestActionType: string) => createSelector(
  selectAsyncActionMap,
  (asyncActionMap) => get(asyncActionMap, getActionName(requestActionType, requestActionPostfix), {}),
);

export const createAsyncActionIsLoadingSelector = (...requestActionTypes: string[]) => createSelector(
  selectAsyncActionMap,
  (asyncActionMap) => {
    return requestActionTypes.some((type) => {
      const actionMap = asyncActionMap[getActionName(type, requestActionPostfix)];
      return !!(actionMap?.isLoading);
    });
  },
);

export const createAsyncActionIsLoadedSelector = (requestActionType: string) => createSelector(
  selectAsyncActionMap,
  (asyncActionMap) => {
    const actionMap = asyncActionMap[getActionName(requestActionType, requestActionPostfix)];
    return actionMap ? actionMap.isLoaded : false;
  },
);

export const createAsyncActionAllErrorsSelector = (requestActionType: string) => createSelector(
  selectAsyncActionMap,
  (asyncActionMap) => {
    const actionMap = asyncActionMap[getActionName(requestActionType, requestActionPostfix)];
    return actionMap?.errors;
  },
);

export const createAsyncActionErrorSelector = (requestActionType: string) => createSelector(
  createAsyncActionAllErrorsSelector(requestActionType),
  (errors) => {
    return errors?.[0];
  },
);

export const selectorAsyncActionCriticalErrors = createSelector(
  selectAsyncActionMap,
  (asyncActionMap) => {
    const errorsReduced = Object.values(asyncActionMap).reduce((errors: ErrorInfo[], asyncAction) => {
      const criticalErrors = asyncAction.errors?.filter(({ type }) => type === ERROR_TYPE.CRITICAL) || [];
      return [...errors, ...criticalErrors];
    }, []) || [];

    return errorsReduced?.[0];
  },
);

export const createAsyncActionValidationErrorsSelector = (requestActionType: string) => createSelector(
  createAsyncActionAllErrorsSelector(requestActionType),
  (errors) => {
    return errors ? errors.filter((error) => error.type === ERROR_TYPE.VALIDATION) : [];
  },
);
