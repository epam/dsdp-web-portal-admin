import { api } from 'api';

import { ProcessDefinitionGroupData } from '#shared/types/processDefinition';
import { API_APPENDIX, VERSION_API_APPENDIX } from 'constants/baseUrl';
import { isMaster } from 'utils/versions';

import { ProcessListItem } from 'types/processes';
import { Api } from './setupApi';

const processApi = new Api(api.baseUrl, { 'Content-Type': 'text/xml' });

export const getProcessList = (version: string) => {
  if (isMaster(version)) {
    return api.get$<ProcessListItem[]>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/business-processes`);
  }
  return api.get$<ProcessListItem[]>(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/business-processes`,
  );
};
export const getProcessByName = (name: string, version: string) => {
  if (isMaster(version)) {
    return processApi.get$<string>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/business-processes/${name}`);
  }
  return processApi.get$<string>(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/business-processes/${name}`,
  );
};
export const updateProcess = (name: string, xml: string, version: string, eTag?: string) => {
  if (isMaster(version)) {
    return processApi.put$(
      `${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/business-processes/${name}`,
      xml,
      eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
    );
  }
  return processApi.put$(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/business-processes/${name}`,
    xml,
    eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
  );
};
export const createProcess = (name: string, xml: string, version: string) => {
  if (isMaster(version)) {
    return processApi.post$(
      `${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/business-processes/${name}`,
      xml,
    );
  }
  return processApi.post$(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/business-processes/${name}`,
    xml,
  );
};
export const deleteProcess = (name: string, version: string, eTag?: string) => {
  if (isMaster(version)) {
    return api.delete$(
      `${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/business-processes/${name}`,
      eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
    );
  }
  return api.delete$(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/business-processes/${name}`,
    eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
  );
};

export const getProcessGroups = (version: string) => {
  if (isMaster(version)) {
    return api.get$<ProcessDefinitionGroupData>(
      `${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/business-process-groups`,
    );
  }
  return api.get$<ProcessDefinitionGroupData>(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/business-process-groups`,
  );
};

export const saveProcessGroups = (groupData: ProcessDefinitionGroupData, version: string) => {
  return api.post$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/business-process-groups`, {
    groups: groupData.groups.map((group) => ({
      ...group,
      processDefinitions: group.processDefinitions.map(({ id }) => id),
    })),
    ungrouped: groupData.ungrouped.map(({ id }) => id),
  });
};
