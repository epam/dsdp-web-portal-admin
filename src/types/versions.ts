import { AnyAction } from '@reduxjs/toolkit';

export type Version = {
  id: string;
  name: string;
  description?: string;
  author?: string;
  latestUpdate?: string;
  published?: boolean;
  inspector?: string;
  validations?: Validation[];
  status?: VersionCheckResult;
};

export type CreateVersion = Pick<Version, 'name' | 'description'>;

export interface CreateVersionParams<S> {
  data: CreateVersion,
  path: string,
  state?: S,
  nextAction?: (id: string) => AnyAction,
}

type Validation = {
  name: string;
  type: string;
  result: string;
  resultDetails: string;
};

export enum VersionCheckResult {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export type CandidateInspection = {
  name: string;
  inspector: string;
  result: VersionCheckResult;
  resultDetails: string;
};

export type CandidateValidation = {
  name: string;
  type: 'REGULATION_INTEGRITY' | 'TEST' | 'DEPLOYMENT_STATUS';
  result: VersionCheckResult;
  resultDetails: string;
};

export type CandidateDetails = {
  id: string;
  name: string;
  description: string;
  author: string;
  creationDate: string;
  latestUpdate: string;
  latestRebase: string;
  hasConflicts: boolean;
  inspections: CandidateInspection[] | null;
  validations: CandidateValidation[] | null;
};

export type VersionsChange = {
  name: string;
  title: string;
  status: string;
};

export type VersionsChanges = {
  changedForms: VersionsChange[];
  changedBusinessProcesses: VersionsChange[];
  changedDataModelFiles: VersionsChange[];
  changedGroups: VersionsChange[];
  changedI18nFiles: VersionsChange[];
};

export enum VersionChangeType {
  CHANGED_FORMS = 'changedForms',
  CHANGED_BUSINESS_PROCESSES = 'changedBusinessProcesses',
  CHANGED_GROUPS = 'changedGroups',
  CHANGED_DATA_MODEL_FILES = 'changedDataModelFiles',
  CHANGED_I18N_FILES = 'changedI18nFiles',
  CHANGED_GLOBAL_SETTING_FILES = 'changedGlobalConfigurationFiles',
}
