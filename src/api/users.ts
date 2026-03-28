import { api } from 'api';
import { API_APPENDIX } from 'constants/baseUrl';
import { importUsersFileInfo } from 'types/importUsers';

const USER_API_APPENDIX = 'api/registry-regulation-management/batch-loads/users';

export const getImportInfo = () => {
  return api.get$<importUsersFileInfo>(`${API_APPENDIX}/${USER_API_APPENDIX}`);
};

export const sendImportFile = (formData: FormData) => {
  return api.post$<importUsersFileInfo>(
    `${API_APPENDIX}/${USER_API_APPENDIX}`,
    formData,
    { isFormData: true },
  );
};

export const startImport = () => {
  return api.post$(`${API_APPENDIX}/${USER_API_APPENDIX}/imports`, {});
};

export const deleteImportFile = (id: string) => {
  return api.delete$(`${API_APPENDIX}/${USER_API_APPENDIX}/${id}`);
};
