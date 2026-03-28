import { ErrorInfo } from '#shared/types/common';
import { PayloadAction, createAction, createSlice } from '@reduxjs/toolkit';
import { BpModelerTemplate } from 'types/config';

export interface ConfigState {
  bpModelerTemplates?: Array<BpModelerTemplate>;
}

export const initialState: ConfigState = {
  bpModelerTemplates: undefined,
};

const ACTION_PREFIX = 'config';

export const getBpModelerTemplatesRequest = createAction(`${ACTION_PREFIX}/getBpModelerTemplatesRequest`);
export const getBpModelerTemplatesError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getBpModelerTemplatesError`);

const configSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getBpModelerTemplatesSuccess(state, action: PayloadAction<ConfigState['bpModelerTemplates']>) {
      return {
        ...state,
        bpModelerTemplates: action.payload,
      };
    },
  },
});

export default configSlice.reducer;

export const {
  getBpModelerTemplatesSuccess,
} = configSlice.actions;
