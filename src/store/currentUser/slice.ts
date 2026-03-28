import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorInfo } from '#shared/types/common';
import { CurrentUser, LoginOptions } from '#shared/types/user';

const ACTION_PREFIX = 'currentUser';

export interface CurrentUserState {
  info: CurrentUser | null,
  initialized: boolean,
  authenticated: boolean,
}

const initialState: CurrentUserState = {
  info: null,
  initialized: false,
  authenticated: false,
};

export const getInfoRequest = createAction(`${ACTION_PREFIX}/getInfoRequest`);
export const getInfoError = createAction<ErrorInfo>(`${ACTION_PREFIX}/getInfoError`);
export const loginRequest = createAction<LoginOptions>(`${ACTION_PREFIX}/loginRequest`);
export const loginError = createAction<ErrorInfo>(`${ACTION_PREFIX}/loginError`);

const CurrentUserSlice = createSlice({
  name: ACTION_PREFIX,
  initialState,
  reducers: {
    getInfoSuccess(state, action: PayloadAction<CurrentUser>) {
      return {
        ...state,
        info: action.payload,
        initialized: true,
        authenticated: true,
      };
    },
  },
  extraReducers: {
    [getInfoRequest.type]: (state) => {
      return {
        ...state,
        info: null,
      };
    },
    [getInfoError.type]: (state) => {
      return {
        ...state,
        initialized: true,
      };
    },
  },
});

export default CurrentUserSlice.reducer;

export const {
  getInfoSuccess,
} = CurrentUserSlice.actions;
