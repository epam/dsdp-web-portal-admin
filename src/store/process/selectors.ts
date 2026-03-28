import { createSelector } from 'reselect';
import { createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import { getBpModelerTemplatesRequest } from 'store/config';
import {
  createProcessRequest, deleteProcessRequest, getProcessByNameRequest, getProcessListRequest, updateProcessRequest,
} from './slice';

export const selectProcessState = (state: RootState) => state.process;
export const selectProcessList = createSelector(
  selectProcessState,
  (processState) => processState.list,
);

export const selectProcessListIsLoading = createAsyncActionIsLoadingSelector(
  getProcessListRequest.type,
  deleteProcessRequest.type,
);

export const selectProcess = createSelector(
  selectProcessState,
  (processState) => processState.process,
);

export const selectEditProcessIsLoading = createAsyncActionIsLoadingSelector(
  getProcessByNameRequest.type,
  updateProcessRequest.type,
);

export const selectCreateProcessIsLoading = createAsyncActionIsLoadingSelector(
  createProcessRequest.type,
  getProcessByNameRequest.type,
  getBpModelerTemplatesRequest.type,
);
export const selectDeleteProcessIsLoading = createAsyncActionIsLoadingSelector(
  deleteProcessRequest.type,
);

export const selectProcessHasConflicts = createSelector(
  selectProcessState,
  (processState) => processState.hasConflicts,
);

export const selectProcessETags = createSelector(
  selectProcessState,
  (processState) => processState.eTags,
);
