import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { Form, FormListItem } from 'types/form';

const ACTION_PREFIX = 'form';

export interface FormState {
  list: FormListItem[],
  form: Form | null,
  hasConflicts: null | boolean,
  eTags: Record<string, string> | null,
}

const initialState: FormState = {
  list: [],
  form: null,
  hasConflicts: null,
  eTags: null,
};

export const getFormListRequest = createAction<string>(`${ACTION_PREFIX}/getFormListRequest`);
export const getFormListError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getFormListError`);

export const createFormRequest = createAction<{ versionId: string, data: Form }>(`${ACTION_PREFIX}/createFormRequest`);
export const createFormSuccess = createAction(`${ACTION_PREFIX}/createFormSuccess`);
export const createFormError = createAction<ErrorInfo>(`${ACTION_PREFIX}/createFormError`);

export const exportFormRequest = createAction<{ name: string, versionId: string }>(
  `${ACTION_PREFIX}/exportFormRequest`,
);
export const exportFormSuccess = createAction(`${ACTION_PREFIX}/exportFormSuccess`);
export const exportFormError = createAction<ErrorInfo>(`${ACTION_PREFIX}/exportFormError`);

export const getFormByNameRequest = createAction<{
  name: string,
  versionId: string,
}>(`${ACTION_PREFIX}/getFormByNameRequest`);
export const getFormByNameError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getFormByNameError`);

export const updateFormRequest = createAction<{ versionId: string, data: Form }>(`${ACTION_PREFIX}/updateFormRequest`);
export const updateFormSuccess = createAction(`${ACTION_PREFIX}/updateFormSuccess`);
export const updateFormError = createAction<ErrorInfo>(`${ACTION_PREFIX}/updateFormError`);

export const deleteFormRequest = createAction<{ name: string, title: string, versionId: string }>(
  `${ACTION_PREFIX}/deleteFormRequest`,
);
export const deleteFormSuccess = createAction<string>(`${ACTION_PREFIX}/deleteFormSuccess`);
export const deleteFormError = createAction<ErrorInfo>(`${ACTION_PREFIX}/deleteFormError`);

const FormSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getFormListSuccess(state, action: PayloadAction<FormListItem[]>) {
      return {
        ...state,
        list: action.payload,
      };
    },
    getFormListClean(state) {
      return {
        ...state,
        list: [],
      };
    },
    getFormByNameSuccess(state, action: PayloadAction<Form>) {
      return {
        ...state,
        form: action.payload,
      };
    },
    getFormByNameClean(state) {
      return {
        ...state,
        form: null,
      };
    },
    setHasConflicts(state, action: PayloadAction<boolean | null>) {
      return {
        ...state,
        hasConflicts: action.payload,
      };
    },
    setFormETags(state, action: PayloadAction<FormState['eTags']>) {
      return {
        ...state,
        eTags: action.payload,
      };
    },
  },
});

export default FormSlice.reducer;

export const {
  getFormListSuccess,
  getFormListClean,
  getFormByNameSuccess,
  getFormByNameClean,
  setHasConflicts,
  setFormETags,
} = FormSlice.actions;
