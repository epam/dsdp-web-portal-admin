import { createSelector } from 'reselect';
import { createAsyncActionIsLoadingSelector, createAsyncActionIsLoadedSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import {
  getCandidateRequest,
  getMasterRequest,
  getVersionsListRequest,
  getCandidateChangesRequest,
  rebaseCandidateRequest,
  createVersionRequest,
} from './slice';

export const selectVersionsState = (state: RootState) => state.versions;
export const selectVersionsList = createSelector(
  selectVersionsState,
  (versions) => versions.versionsList,
);

export const selectMaster = createSelector(
  selectVersionsState,
  (versions) => versions.master,
);

export const selectCandidate = createSelector(
  selectVersionsState,
  (versions) => versions.candidate,
);

export const selectMasterIsLoading = createAsyncActionIsLoadingSelector(getMasterRequest.type);
export const selectCandidateIsLoading = createAsyncActionIsLoadingSelector(getCandidateRequest.type);

export const selectVersionsListIsLoading = createAsyncActionIsLoadingSelector(getVersionsListRequest.type);
export const selectVersionsListIsLoaded = createAsyncActionIsLoadedSelector(getVersionsListRequest.type);
export const selectCandidateChangesIsLoading = createAsyncActionIsLoadingSelector(getCandidateChangesRequest.type);
export const selectRebaseCandidateIsLoading = createAsyncActionIsLoadingSelector(rebaseCandidateRequest.type);
export const selectCreateCandidateIsLoading = createAsyncActionIsLoadingSelector(createVersionRequest.type);

export const selectCandidateChanges = createSelector(
  selectVersionsState,
  (versions) => (versions.versionChanges ? Object.entries(versions.versionChanges) : []),
);
export const selectChangesRebased = createSelector(
  selectVersionsState,
  (versions) => versions.changesRebased,
);
