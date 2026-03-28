import { createSelector } from 'reselect';
import { createAsyncActionIsLoadingSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import {
  createFormRequest,
  getFormListRequest,
  getFormByNameRequest,
  updateFormRequest,
  exportFormRequest,
  deleteFormRequest,
} from './slice';

export const selectFormState = (state: RootState) => state.form;
export const selectFormList = createSelector(
  selectFormState,
  (formState) => formState.list,
);
export const selectForm = createSelector(
  selectFormState,
  (formState) => formState.form,
);
export const selectFormListIsLoading = createAsyncActionIsLoadingSelector(
  getFormListRequest.type,
  createFormRequest.type,
  exportFormRequest.type,
  getFormByNameRequest.type,
  deleteFormRequest.type,
);
export const selectCreateFormIsLoading = createAsyncActionIsLoadingSelector(
  createFormRequest.type,
  getFormByNameRequest.type,
);
export const selectUpdateFormIsLoading = createAsyncActionIsLoadingSelector(
  updateFormRequest.type,
);
export const selectGetFormByNameIsLoading = createAsyncActionIsLoadingSelector(
  getFormByNameRequest.type,
);
export const selectDeleteFormIsLoading = createAsyncActionIsLoadingSelector(
  deleteFormRequest.type,
);

export const selectExportFormIsLoading = createAsyncActionIsLoadingSelector(
  exportFormRequest.type,
);

export const selectHasConflicts = createSelector(
  selectFormState,
  (formState) => formState.hasConflicts,
);

export const selectFormETags = createSelector(
  selectFormState,
  (formState) => formState.eTags,
);
