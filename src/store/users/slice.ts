import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { importUsersFileInfo } from 'types/importUsers';

const ACTION_PREFIX = 'importUsers';

export interface UsersState {
  fileInfo: importUsersFileInfo | null,
}

const initialState: UsersState = {
  fileInfo: null,
};

export const getImportInfoRequest = createAction(`${ACTION_PREFIX}/getImportInfoRequest`);
export const getImportInfoError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getImportInfoError`);

export const sendImportFileRequest = createAction<FormData>(`${ACTION_PREFIX}/sendImportFileRequest`);
export const sendImportFileError = createAction<ErrorInfo>(`${ACTION_PREFIX}/sendImportFileError`);

export const startImportRequest = createAction<{ versionId: string }>(`${ACTION_PREFIX}/startImportRequest`);
export const startImportSuccess = createAction(`${ACTION_PREFIX}/startImportSuccess`);
export const startImportError = createAction<ErrorInfo>(`${ACTION_PREFIX}/startImportError`);

export const deleteImportFileRequest = createAction<string>(`${ACTION_PREFIX}/deleteImportFileRequest`);
export const deleteImportFileError = createAction<ErrorInfo>(`${ACTION_PREFIX}/deleteImportFileError`);

const usersSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getImportInfoSuccess(state, action: PayloadAction<importUsersFileInfo>) {
      return {
        ...state,
        fileInfo: action.payload,
      };
    },
    sendImportFileSuccess(state, action: PayloadAction<importUsersFileInfo>) {
      return {
        ...state,
        fileInfo: action.payload,
      };
    },
    sendImportFileClean(state) {
      return {
        ...state,
        fileInfo: null,
      };
    },
    deleteImportFileSuccess(state) {
      return {
        ...state,
        fileInfo: null,
      };
    },
  },
});

export default usersSlice.reducer;

export const {
  getImportInfoSuccess,
  sendImportFileSuccess,
  sendImportFileClean,
  deleteImportFileSuccess,
} = usersSlice.actions;
