import { RootState } from 'store/rootReducer';

export const selectNotifications = (state: RootState) => state.notifications;
