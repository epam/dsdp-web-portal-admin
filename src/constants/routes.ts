import { VERSION_ID } from 'constants/common';
import packageJson from '../../package.json';

export const APP_URL_PREFIX = packageJson.homepage;

export const ROUTES = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  KONG_HOME: '/home',
  HOME: `/${VERSION_ID}/home`,
  GLOBAL_SETTINGS: `/${VERSION_ID}/settings`,
  FORM_LIST: `/${VERSION_ID}/form-list`,
  REPORT_LIST: `/${VERSION_ID}/report-list`,
  CREATE_FORM: `/${VERSION_ID}/form/create`,
  EDIT_FORM: `/${VERSION_ID}/form/edit/:formId`,
  CREATE_PROCESS: `/${VERSION_ID}/process/create`,
  EDIT_PROCESS: `/${VERSION_ID}/process/edit/:processName`,
  READ_ONLY_PROCESS: `/${VERSION_ID}/process/preview/:processName`,
  EDIT_TABLE: `/${VERSION_ID}/table/edit/:tableName`,
  PREVIEW_FORM: `/${VERSION_ID}/form/edit/:formId?mode=preview`,
  READ_ONLY_PREVIEW_FORM: `/${VERSION_ID}/form/preview/:formId`,
  FORBIDDEN: `/${VERSION_ID}/forbidden`,
  USERS: `/${VERSION_ID}/users`,
  IMPORT_USERS: `/${VERSION_ID}/import-users`,
  IMPORT_USERS_SUCCESS: `/${VERSION_ID}/import-users-success`,
  PROCESS_LIST: `/${VERSION_ID}/process-list`,
  TABLE_LIST: `/${VERSION_ID}/table-list`,
  I18N_LIST: `/${VERSION_ID}/i18n-list`,
};
