import { createSelector } from 'reselect';
import { createAsyncActionErrorSelector, createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import {
  getProcessGroupDataRequest,
} from './slice';

export const selectProcessState = (state: RootState) => state.processGroups;
export const selectGroupData = createSelector(
  selectProcessState,
  (processState) => processState.groupData,
);

export const selectGroupDataEdit = createSelector(
  selectProcessState,
  (processState) => processState.groupDataEdit,
);

export const selectGroupDataIsLoading = createAsyncActionIsLoadingSelector(
  getProcessGroupDataRequest.type,
);

export const selectGroupDataError = createAsyncActionErrorSelector(getProcessGroupDataRequest.type);
