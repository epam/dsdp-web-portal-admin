import { api } from 'api';
import { API_APPENDIX, VERSION_API_APPENDIX } from 'constants/baseUrl';
import { isMaster } from 'utils/versions';
import { Settings } from 'types/settings';

export const getSettings = (version: string) => {
  if (isMaster(version)) {
    return api.get$<Settings>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/settings`);
  }
  return api.get$<Settings>(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/settings`);
};

export const updateSettings = (payload: Settings, version: string) => {
  return api.put$<Settings>(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/settings`,
    payload,
  );
};
