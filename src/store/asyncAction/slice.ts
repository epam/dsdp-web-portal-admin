import { createSlice } from '@reduxjs/toolkit';
import isArray from 'lodash/isArray';

import { ErrorInfo } from '#shared/types/common';
import {
  cleanActionPostfix,
  errorActionPostfix,
  requestActionPostfix,
  successActionPostfix,
} from './constants';
import {
  getActionName,
  isRequestAction,
  isSuccessAction,
  isErrorAction,
  isCleanAction,
  RejectedAction,
} from './utils';

interface AsyncActionMapItem {
  isLoading: boolean;
  isLoaded: boolean;
  errors?: Array<ErrorInfo>;
}

export interface AsyncActionState {
  asyncActionMap: Record<string, AsyncActionMapItem>;
}

const initialState: AsyncActionState = {
  asyncActionMap: {},
};

const ErrorsSlice = createSlice({
  name: 'asyncAction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isRequestAction,
        (state, action) => {
          return {
            ...state,
            asyncActionMap: {
              ...state.asyncActionMap,
              [getActionName(action.type, requestActionPostfix)]: { isLoading: true, isLoaded: false },
            },
          };
        },
      )
      .addMatcher(
        isErrorAction,
        (state, action: RejectedAction) => {
          return {
            ...state,
            asyncActionMap: {
              ...state.asyncActionMap,
              [getActionName(action.type, errorActionPostfix)]: {
                isLoading: false, isLoaded: false, errors: isArray(action.payload) ? action.payload : [action.payload],
              },
            },
          };
        },
      )
      .addMatcher(
        isCleanAction,
        (state, action) => {
          return {
            ...state,
            asyncActionMap: {
              ...state.asyncActionMap,
              [getActionName(action.type, cleanActionPostfix)]: { isLoading: false, isLoaded: false },
            },
          };
        },
      )
      .addMatcher(
        isSuccessAction,
        (state, action) => {
          return {
            ...state,
            asyncActionMap: {
              ...state.asyncActionMap,
              [getActionName(action.type, successActionPostfix)]: { isLoading: false, isLoaded: true },
            },
          };
        },
      );
  },
});

export default ErrorsSlice.reducer;
