import { CurrentUser } from '#shared/types/user';
import { api, isAvoidAuth } from 'api';
import { API_APPENDIX } from 'constants/baseUrl';
import { ROUTES } from 'constants/routes';
import { timeout } from 'rxjs/operators';

export const login = () => {
  return api.get$(`${API_APPENDIX}${ROUTES.KONG_HOME}`);
};

export const getInfo = () => {
  return api.get$<CurrentUser>(`${API_APPENDIX}/api/userinfo`).pipe(isAvoidAuth ? timeout(250) : (o) => o);
};
