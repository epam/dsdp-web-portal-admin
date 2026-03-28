import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { I18nListItem } from 'types/i18n';

const ACTION_PREFIX = 'i18n';

export interface I18nState {
  list: I18nListItem[],
  i18nContent: null | string,
  hasConflicts: null | boolean,
  eTags: Record<string, string> | null,
}

const initialState: I18nState = {
  list: [],
  i18nContent: null,
  hasConflicts: null,
  eTags: null,
};

export const getI18nListRequest = createAction<string>(`${ACTION_PREFIX}/getI18nListRequest`);
export const getI18nListError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getI18nListError`);

export const getI18nByNameRequest = createAction<{
  versionId: string,
  name: string,
}>(`${ACTION_PREFIX}/getI18nByNameRequest`);
export const getI18nByNameError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getI18nByNameError`);

export const createI18nRequest = createAction<{
  name: string,
  versionId: string,
  i18nContent: string
}>(`${ACTION_PREFIX}/createI18nRequest`);
export const createI18nSuccess = createAction<string>(`${ACTION_PREFIX}/createI18nSuccess`);
export const createI18nError = createAction<ErrorInfo>(`${ACTION_PREFIX}/createI18nError`);

export const updateI18nRequest = createAction<{
  versionId: string,
  name: string,
  i18nContent: string,
}>(`${ACTION_PREFIX}/updateI18nRequest`);
export const updateI18nSuccess = createAction<string>(`${ACTION_PREFIX}/updateI18nSuccess`);
export const updateI18nError = createAction<ErrorInfo>(`${ACTION_PREFIX}/updateI18nError`);

export const deleteI18nRequest = createAction<{ name: string, versionId: string }>(
  `${ACTION_PREFIX}/deleteI18nRequest`,
);
export const deleteI18nSuccess = createAction<string>(`${ACTION_PREFIX}/deleteI18nSuccess`);
export const deleteI18nError = createAction<ErrorInfo>(`${ACTION_PREFIX}/deleteI18nError`);

const I18nSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getI18nListSuccess(state, action: PayloadAction<I18nListItem[]>) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getI18nListClean(state) {
      return {
        ...state,
        list: [],
      };
    },
    getI18nByNameSuccess(state, action: PayloadAction<string>) {
      return {
        ...state,
        i18nContent: action.payload,
      };
    },
    getI18nByNameClean(state) {
      return {
        ...state,
        i18nContent: null,
      };
    },
    setHasConflicts(state, action: PayloadAction<boolean | null>) {
      return {
        ...state,
        hasConflicts: action.payload,
      };
    },
    setI18nETags(state, action: PayloadAction<I18nState['eTags']>) {
      return {
        ...state,
        eTags: action.payload,
      };
    },
  },
});

export default I18nSlice.reducer;

export const {
  getI18nListSuccess,
  getI18nListClean,
  getI18nByNameSuccess,
  getI18nByNameClean,
  setI18nETags,
  setHasConflicts,
} = I18nSlice.actions;
