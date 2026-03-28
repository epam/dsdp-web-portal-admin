import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import {
  CandidateDetails, Version, VersionsChange, VersionsChanges, VersionChangeType, CreateVersionParams,
} from 'types/versions';

const ACTION_PREFIX = 'versions';

export interface VersionsState {
  versionsList: Version[],
  master: Version | null,
  candidate: CandidateDetails | null,
  versionChanges: VersionsChanges | null,
  changesRebased: boolean,
}

const initialState: VersionsState = {
  versionsList: [],
  master: null,
  candidate: null,
  versionChanges: null,
  changesRebased: false,
};

const createActionVersionRequest = <S>() => {
  return createAction<CreateVersionParams<S>>(`${ACTION_PREFIX}/createVersionRequest`);
};

export const getVersionsListRequest = createAction(`${ACTION_PREFIX}/getVersionsListRequest`);
export const getVersionsListError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getVersionsListError`);

export const createVersionRequest = createActionVersionRequest();
export const createVersionSuccess = createAction(`${ACTION_PREFIX}/createVersionSuccess`);
export const createVersionError = createAction<ErrorInfo>(`${ACTION_PREFIX}/createVersionError`);

export const getMasterRequest = createAction(`${ACTION_PREFIX}/getMasterRequest`);
export const getMasterError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getMasterError`);

export const getCandidateRequest = createAction<string>(`${ACTION_PREFIX}/getCandidateRequest`);
export const getCandidateError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getCandidateError`);

export const mergeCandidateRequest = createAction<string>(`${ACTION_PREFIX}/mergeCandidateRequest`);
export const mergeCandidateSuccess = createAction(`${ACTION_PREFIX}/mergeCandidateSuccess`);
export const mergeCandidateError = createAction<ErrorInfo>(`${ACTION_PREFIX}/mergeCandidateError`);

export const revertChangeRequest = createAction<{
  changeType: VersionChangeType,
  changeItem: VersionsChange,
  versionId: string,
}>(`${ACTION_PREFIX}/revertChangeRequest`);
export const revertChangeSuccess = createAction(`${ACTION_PREFIX}/revertChangeSuccess`);
export const revertChangeError = createAction<ErrorInfo>(`${ACTION_PREFIX}/revertChangeError`);

export const abandonCandidateRequest = createAction<string>(`${ACTION_PREFIX}/abandonCandidateRequest`);
export const abandonCandidateSuccess = createAction(`${ACTION_PREFIX}/abandonCandidateSuccess`);
export const abandonCandidateError = createAction<ErrorInfo>(`${ACTION_PREFIX}/abandonCandidateError`);

export const rebaseCandidateRequest = createAction<string>(`${ACTION_PREFIX}/rebaseCandidateRequest`);
export const rebaseCandidateError = createAction<ErrorInfo>(`${ACTION_PREFIX}/rebaseCandidateError`);

export const getCandidateChangesRequest = createAction<string>(`${ACTION_PREFIX}/getCandidateChangesRequest`);
export const getCandidateChangesError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getCandidateChangesError`);

const versionsSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getVersionsListSuccess(state, action: PayloadAction<Version[]>) {
      return {
        ...state,
        versionsList: action.payload,
      };
    },
    getMasterSuccess(state, action: PayloadAction<Version>) {
      return {
        ...state,
        master: action.payload,
      };
    },
    getCandidateSuccess(state, action: PayloadAction<CandidateDetails>) {
      return {
        ...state,
        candidate: action.payload,
      };
    },
    getCandidateChangesSuccess(state, action: PayloadAction<VersionsChanges>) {
      return {
        ...state,
        versionChanges: action.payload,
      };
    },
    rebaseCandidateSuccess(state) {
      return {
        ...state,
        changesRebased: true,
      };
    },
    rebaseCandidateClean(state) {
      return {
        ...state,
        changesRebased: initialState.changesRebased,
      };
    },
  },
});

export default versionsSlice.reducer;

export const {
  getVersionsListSuccess,
  getMasterSuccess,
  getCandidateSuccess,
  getCandidateChangesSuccess,
  rebaseCandidateSuccess,
  rebaseCandidateClean,
} = versionsSlice.actions;
