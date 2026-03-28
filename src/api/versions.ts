import { api } from 'api';
import { API_APPENDIX, VERSION_API_APPENDIX } from 'constants/baseUrl';
import {
  CreateVersion, VersionsChange, VersionChangeType, Version,
  CandidateDetails,
  VersionsChanges,
} from 'types/versions';
import { throwError } from 'rxjs';

export const getVersionsList = () => {
  return api.get$<Version[]>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates`);
};

export const createVersion = (payload: CreateVersion) => {
  return api.post$<{ id: string }>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates`, payload);
};

export const getMaster = () => {
  return api.get$<Version>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/master`);
};

export const getCandidate = (id: string) => {
  return api.get$<CandidateDetails>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}`);
};

export const mergeCandidate = (id: string) => {
  return api.post$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/submit`, {});
};

export const rebaseCandidate = (id: string) => {
  return api.put$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/rebase`, {});
};

export const abandonCandidate = (id: string) => {
  return api.post$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/decline`, {});
};

export const getCandidateChanges = (id: string) => {
  return api.get$<VersionsChanges>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/changes`);
};

export const revertChange = (id: string, changeType: VersionChangeType, changeItem: VersionsChange) => {
  switch (changeType) {
    case VersionChangeType.CHANGED_FORMS:
      return api.post$(
        `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/forms/${changeItem.name}/rollback`,
        {},
      );
    case VersionChangeType.CHANGED_BUSINESS_PROCESSES:
      return api.post$(
        `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/business-processes/${changeItem.name}/rollback`,
        {},
      );
    case VersionChangeType.CHANGED_GROUPS:
      return api.post$(
        `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/business-process-groups/rollback`,
        {},
      );
    case VersionChangeType.CHANGED_DATA_MODEL_FILES:
      return api.post$(
        `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/data-model/tables/rollback`,
        {},
      );
    case VersionChangeType.CHANGED_I18N_FILES:
      return api.post$(
        `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/i18n/${changeItem.name}/rollback`,
        {},
      );
    case VersionChangeType.CHANGED_GLOBAL_SETTING_FILES:
      return api.post$(
        `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${id}/settings/${changeItem.name}/rollback`,
        {},
      );
    default:
      return throwError({});
  }
};
