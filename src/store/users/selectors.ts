import { createSelector } from 'reselect';
import { createAsyncActionErrorSelector, createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import type { RootState } from 'store/rootReducer';
import {
  getImportInfoRequest,
  sendImportFileRequest,
  startImportRequest,
  deleteImportFileRequest,
} from './slice';

export const selectUsersState = (state: RootState) => state.users;
export const selectImportUsersFileInfo = createSelector(
  selectUsersState,
  (users) => users.fileInfo,
);

export const selectDropzoneError = createAsyncActionErrorSelector(sendImportFileRequest.type);

export const selectDropzoneIsLoading = createAsyncActionIsLoadingSelector(
  getImportInfoRequest.type,
  startImportRequest.type,
  deleteImportFileRequest.type,
);

export const selectFileIsLoading = createAsyncActionIsLoadingSelector(sendImportFileRequest.type);
