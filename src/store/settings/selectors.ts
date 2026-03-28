import { createSelector } from 'reselect';
import { createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import {
  getSettingsRequest,
  updateSettingsRequest,
} from './slice';

export const selectSettingsState = (state: RootState) => state.settings;

export const selectSettings = createSelector(
  selectSettingsState,
  ({ settings }) => settings,
);

export const selectMasterSupportEmail = createSelector(
  selectSettingsState,
  ({ masterSupportEmail }) => masterSupportEmail,
);

export const selectSettingsIsLoading = createAsyncActionIsLoadingSelector(getSettingsRequest.type);
export const selectUpdateSettingsIsLoading = createAsyncActionIsLoadingSelector(updateSettingsRequest.type);
