import { createSelector } from 'reselect';
import { createAsyncActionIsLoadedSelector, createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import { getBpModelerTemplatesRequest } from './slice';

export const selectConfigState = (state: RootState) => state.config;

export const selectBpModelerTemplates = createSelector(
  selectConfigState,
  (state) => state.bpModelerTemplates,
);

export const selectBpModelerTemplatesIsLoaded = createAsyncActionIsLoadedSelector(getBpModelerTemplatesRequest.type);
export const selectBpModelerTemplatesIsLoading = createAsyncActionIsLoadingSelector(getBpModelerTemplatesRequest.type);
