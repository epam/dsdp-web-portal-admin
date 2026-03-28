import { createSelector } from 'reselect';
import { createAsyncActionErrorSelector } from 'store/asyncAction';
import { RootState } from 'store/rootReducer';
import { getInfoRequest } from './slice';

export const selectCurrentUserState = (state: RootState) => state.currentUser;
export const selectCurrentUserInfo = createSelector(
  selectCurrentUserState,
  (user) => user.info,
);

export const selectCurrentUserAuthenticated = createSelector(
  selectCurrentUserState,
  (user) => user.authenticated,
);

export const selectCurrentUserInitialized = createSelector(
  selectCurrentUserState,
  (user) => user.initialized,
);

export const selectCurrentUserError = createSelector(
  createAsyncActionErrorSelector(getInfoRequest.type),
  (errors) => {
    return errors && errors.httpStatus !== 401;
  },
);
