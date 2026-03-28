import { combineReducers, Reducer } from 'redux';
import { Notification, reducer as notificationsReducer } from 'reapop';
import CurrentUserReducer, { CurrentUserState } from './currentUser';
import FormReducer, { FormState } from './form';
import I18nReducer, { I18nState } from './i18n';
import ProcessReducer, { ProcessState } from './process';
import ReportReducer, { ReportState } from './report';
import usersReducer, { UsersState } from './users';
import versionsReducer, { VersionsState } from './versions';
import settingsReducer, { SettingsState } from './settings';
import AsyncActionReducer, { AsyncActionState } from './asyncAction';
import TablesReducer, { TablesState } from './tables/slice';
import ProcessGroupsReducer, { ProcessGroupsState } from './processGroups/slice';
import ConfigReducer, { ConfigState } from './config/slice';

export interface RootState {
  asyncAction: AsyncActionState;
  currentUser: CurrentUserState;
  form: FormState;
  i18n: I18nState;
  process: ProcessState;
  processGroups: ProcessGroupsState;
  report: ReportState;
  users: UsersState;
  versions: VersionsState;
  settings: SettingsState;
  notifications: Notification[];
  tables: TablesState;
  config: ConfigState;
}

export const rootReducer = (): Reducer<RootState> => combineReducers({
  asyncAction: AsyncActionReducer,
  currentUser: CurrentUserReducer,
  form: FormReducer,
  i18n: I18nReducer,
  process: ProcessReducer,
  processGroups: ProcessGroupsReducer,
  report: ReportReducer,
  users: usersReducer,
  versions: versionsReducer,
  tables: TablesReducer,
  settings: settingsReducer,
  notifications: notificationsReducer(),
  config: ConfigReducer,
});
