import { combineEpics } from 'redux-observable';
import { Action } from '@reduxjs/toolkit';

import { getUserInfoEpic, userLoginEpic } from './currentUser';

import { RootState } from './rootReducer';

import {
  createFormEpic,
  exportFormEpic,
  getFormListEpic,
  getFormByNameEpic,
  updateFormEpic,
  deleteFormEpic,
  refreshFormListEpic,
} from './form';
import {
  createI18nEpic,
  deleteI18nEpic,
  getI18nByNameEpic,
  getI18nListEpic,
  refreshI18nListEpic, updateI18nEpic,
} from './i18n';
import { getReportListEpic } from './report';
import { handleNonCriticalErrorsEpic } from './asyncAction';
import {
  getImportInfoEpic, sendImportFileEpic, startImportEpic, deleteImportFileEpic,
} from './users';
import {
  getVersionsListEpic,
  createVersionEpic,
  getMasterEpic,
  getCandidateEpic,
  mergeCandidateEpic,
  abandonCandidateEpic,
  getCandidateChangesEpic,
  rebaseCandidateEpic,
  revertChangeEpic,
} from './versions';
import {
  createProcessEpic,
  deleteProcessEpic,
  getProcessByNameEpic,
  getProcessListEpic,
  refreshProcessListEpic,
  updateProcessEpic,
} from './process';
import {
  getSettingsEpic,
  updateSettingsEpic,
  getMasterSupportEmailEpic,
} from './settings';
import { getProcessGroupDataEpic, saveProcessGroupDataEpic } from './processGroups';
import {
  getTableByNameEpic, getTablesListEpic, getTableDataModelEpic, updateTableDataModelEpic,
} from './tables';
import { getBpModelerTemplatesEpic } from './config';

export const rootEpic = combineEpics<Action, Action, RootState>(
  userLoginEpic,
  getUserInfoEpic,
  getFormListEpic,
  createFormEpic,
  getFormByNameEpic,
  updateFormEpic,
  handleNonCriticalErrorsEpic,
  exportFormEpic,
  deleteFormEpic,
  refreshFormListEpic,
  getReportListEpic,
  getImportInfoEpic,
  sendImportFileEpic,
  startImportEpic,
  deleteImportFileEpic,
  getVersionsListEpic,
  createVersionEpic,
  getMasterEpic,
  getCandidateEpic,
  mergeCandidateEpic,
  abandonCandidateEpic,
  rebaseCandidateEpic,
  revertChangeEpic,
  getProcessListEpic,
  getCandidateChangesEpic,
  getProcessByNameEpic,
  updateProcessEpic,
  createProcessEpic,
  refreshProcessListEpic,
  deleteProcessEpic,
  getTablesListEpic,
  getSettingsEpic,
  updateSettingsEpic,
  getMasterSupportEmailEpic,
  getTableByNameEpic,
  getProcessGroupDataEpic,
  saveProcessGroupDataEpic,
  getTableDataModelEpic,
  updateTableDataModelEpic,
  getBpModelerTemplatesEpic,
  getI18nListEpic,
  createI18nEpic,
  getI18nByNameEpic,
  updateI18nEpic,
  deleteI18nEpic,
  refreshI18nListEpic,
);
