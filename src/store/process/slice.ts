import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { ProcessListItem } from 'types/processes';

const ACTION_PREFIX = 'process';

export interface ProcessState {
  list: ProcessListItem[],
  process: string | null,
  hasConflicts: null | boolean,
  eTags: Record<string, string> | null,
}

const initialState: ProcessState = {
  list: [],
  process: null,
  hasConflicts: null,
  eTags: null,
};

export const getProcessListRequest = createAction<string>(`${ACTION_PREFIX}/getProcessListRequest`);
export const getProcessListError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getProcessListError`);
export const getProcessByNameRequest = createAction<{
  name: string,
  versionId: string,
}>(`${ACTION_PREFIX}/getProcessByNameRequest`);
export const getProcessByNameError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getProcessByNameError`);

export const updateProcessRequest = createAction<{
  versionId: string,
  data: string,
  name: string,
  title: string,
}>(`${ACTION_PREFIX}/updateProcessRequest`);
export const updateProcessSuccess = createAction(`${ACTION_PREFIX}/updateProcessSuccess`);
export const updateProcessError = createAction<ErrorInfo>(`${ACTION_PREFIX}/updateProcessError`);

export const createProcessRequest = createAction<{
  versionId: string,
  data: string,
  title: string,
  name: string,
}>(`${ACTION_PREFIX}/createProcessRequest`);
export const createProcessSuccess = createAction(`${ACTION_PREFIX}/createProcessSuccess`);
export const createProcessError = createAction<ErrorInfo>(`${ACTION_PREFIX}/createProcessError`);

export const deleteProcessRequest = createAction<{ name: string, title: string, versionId: string }>(
  `${ACTION_PREFIX}/deleteProcessRequest`,
);
export const deleteProcessSuccess = createAction<string>(`${ACTION_PREFIX}/deleteProcessSuccess`);
export const deleteProcessError = createAction<ErrorInfo>(`${ACTION_PREFIX}/deleteProcessError`);

const ProcessesSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getProcessListSuccess(state, action: PayloadAction<ProcessListItem[]>) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getProcessListClean(state) {
      return {
        ...state,
        list: [],
      };
    },
    getProcessByNameSuccess(state, action: PayloadAction<string>) {
      return {
        ...state,
        process: action.payload,
      };
    },
    getProcessByNameClean(state) {
      return {
        ...state,
        process: null,
      };
    },
    setProcessHasConflicts(state, action: PayloadAction<boolean | null>) {
      return {
        ...state,
        hasConflicts: action.payload,
      };
    },
    setProcessETags(state, action: PayloadAction<ProcessState['eTags']>) {
      return {
        ...state,
        eTags: action.payload,
      };
    },
  },
});

export default ProcessesSlice.reducer;

export const {
  getProcessListSuccess,
  getProcessListClean,
  getProcessByNameClean,
  getProcessByNameSuccess,
  setProcessHasConflicts,
  setProcessETags,
} = ProcessesSlice.actions;
