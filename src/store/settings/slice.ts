import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { Settings } from 'types/settings';

const ACTION_PREFIX = 'settings';

export interface SettingsState {
  masterSupportEmail: string | null,
  settings: Settings | null,
}

const initialState: SettingsState = {
  masterSupportEmail: null,
  settings: null,
};

export const getMasterSupportEmailRequest = createAction(`${ACTION_PREFIX}/getMasterSupportEmailRequest`);
export const getMasterSupportEmailError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getMasterSupportEmailError`);

export const getSettingsRequest = createAction<string>(`${ACTION_PREFIX}/getSettingsRequest`);
export const getSettingsError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getSettingsError`);

export const updateSettingsRequest = createAction<{ settings: Settings, versionId: string }>(
  `${ACTION_PREFIX}/updateSettingsRequest`,
);
export const updateSettingsError = createAction<ErrorInfo>(`${ACTION_PREFIX}/updateSettingsError`);

const versionsSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getSettingsSuccess(state, action: PayloadAction<Settings>) {
      return {
        ...state,
        settings: action.payload,
      };
    },
    getMasterSupportEmailSuccess(state, action: PayloadAction<Settings>) {
      return {
        ...state,
        masterSupportEmail: action.payload.supportEmail || null,
      };
    },
    updateSettingsSuccess(state, action: PayloadAction<Settings>) {
      return {
        ...state,
        settings: action.payload,
      };
    },
  },
});

export default versionsSlice.reducer;

export const {
  getSettingsSuccess,
  getMasterSupportEmailSuccess,
  updateSettingsSuccess,
} = versionsSlice.actions;
