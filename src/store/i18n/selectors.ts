import { createSelector } from 'reselect';
import { createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import {
  createI18nRequest,
  deleteI18nRequest,
  getI18nByNameRequest,
  getI18nListRequest,
  updateI18nRequest,
} from './slice';

export const selectI18nState = (state: RootState) => state.i18n;

export const selectI18nList = createSelector(
  selectI18nState,
  (i18nState) => i18nState.list,
);

export const selectI18nByName = createSelector(
  selectI18nState,
  (i18nState) => i18nState.i18nContent,
);

export const selectI18nListIsLoading = createAsyncActionIsLoadingSelector(
  getI18nListRequest.type,
  getI18nByNameRequest.type,
  createI18nRequest.type,
  updateI18nRequest.type,
  deleteI18nRequest.type,
);

export const selectI18nETags = createSelector(
  selectI18nState,
  (i18nState) => i18nState.eTags,
);

export const selectHasConflicts = createSelector(
  selectI18nState,
  (i18nState) => i18nState.hasConflicts,
);
