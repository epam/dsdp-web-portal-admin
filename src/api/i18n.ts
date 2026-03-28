import { api } from 'api';
import { API_APPENDIX, VERSION_API_APPENDIX } from 'constants/baseUrl';
import { I18nListItem } from 'types/i18n';
import { isMaster } from 'utils/versions';

const getBaseUrl = (version: string) => {
  return isMaster(version)
    ? `${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/i18n`
    : `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/i18n`;
};

export const getI18nList = (version: string) => {
  return api.get$<I18nListItem[]>(getBaseUrl(version));
};

export const getI18nByName = (name: string, version: string) => {
  return api.get$<I18nListItem>(`${getBaseUrl(version)}/${name}`);
};

export const createI18n = (name: string, version: string, i18nContent: string) => {
  const body = JSON.parse(i18nContent);
  return api.post$(
    `${getBaseUrl(version)}/${name}`,
    { ...body },
  );
};

export const updateI18n = (name: string, version: string, i18nContent: string, eTag?: string) => {
  const body = JSON.parse(i18nContent);
  return api.put$(
    `${getBaseUrl(version)}/${name}`,
    { ...body },
    eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
  );
};

export const deleteI18n = (name: string, version: string, eTag?: string) => {
  return api.delete$(
    `${getBaseUrl(version)}/${name}`,
    eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
  );
};
