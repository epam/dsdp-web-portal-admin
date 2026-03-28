import { api } from 'api';
import { API_APPENDIX, VERSION_API_APPENDIX } from 'constants/baseUrl';
import { isMaster } from 'utils/versions';
import { RegistryTable, TableListItem } from 'types/table';
import { Api } from './setupApi';

const dataModelApi = new Api(api.baseUrl, { 'Content-Type': 'text/xml' });

export const getTableList = (version: string) => {
  if (isMaster(version)) {
    return api.get$<TableListItem[]>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/tables`);
  }
  return api.get$<TableListItem[]>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/tables`);
};

export const getTableByName = (version: string, name: string) => {
  if (isMaster(version)) {
    return api.get$<RegistryTable>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/tables/${name}`);
  }
  return api.get$<RegistryTable>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/tables/${name}`);
};

export const getTableDataModel = (version: string) => {
  if (isMaster(version)) {
    return dataModelApi.get$<string>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/data-model/tables`);
  }
  return dataModelApi.get$<string>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/data-model/tables`);
};

export const updateTableDataModel = (payload: string, version: string) => {
  return dataModelApi.put$<string>(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/data-model/tables`,
    payload,
  );
};
