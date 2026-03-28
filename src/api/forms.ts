import { api } from 'api';
import { API_APPENDIX, VERSION_API_APPENDIX } from 'constants/baseUrl';
import { MASTER_VERSION_ID } from 'constants/common';
import { Form } from 'types/form';
import { isMaster } from 'utils/versions';

export const getFormList = (version: string) => {
  if (isMaster(version)) {
    return api.get$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/forms`);
  }
  return api.get$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/forms`);
};

export const createForm = (payload: Form, version: string) => {
  if (isMaster(version)) {
    return api.post$(
      `${API_APPENDIX}/${VERSION_API_APPENDIX}/${MASTER_VERSION_ID}/forms/${payload.name}`,
      { ...payload },
    );
  }
  return api.post$(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/forms/${payload.name}`,
    { ...payload },
  );
};

export const getFormByName = (name: string, version: string) => {
  if (isMaster(version)) {
    return api.get$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/${version}/forms/${name}`);
  }
  return api.get$(`${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/forms/${name}`);
};

export const updateForm = (payload: Form, version: string, eTag?: string) => {
  if (isMaster(version)) {
    return api.put$(
      `${API_APPENDIX}/${VERSION_API_APPENDIX}/${MASTER_VERSION_ID}/forms/${payload.name}`,
      { ...payload },
      eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
    );
  }
  return api.put$(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/forms/${payload.name}`,
    { ...payload },
    eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
  );
};

export const deleteForm = (name: string, version: string, eTag?: string) => {
  if (isMaster(version)) {
    return api.delete$(
      `${API_APPENDIX}/${VERSION_API_APPENDIX}/${MASTER_VERSION_ID}/forms/${name}`,
      eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
    );
  }
  return api.delete$(
    `${API_APPENDIX}/${VERSION_API_APPENDIX}/candidates/${version}/forms/${name}`,
    eTag ? ({ headers: { 'If-Match': eTag } }) : undefined,
  );
};
