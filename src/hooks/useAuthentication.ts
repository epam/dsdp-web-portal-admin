import { API_APPENDIX, API_URL } from 'constants/baseUrl';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import {
  getInfoRequest,
  selectCurrentUserAuthenticated,
  selectCurrentUserError,
  selectCurrentUserInfo,
  selectCurrentUserInitialized,
} from 'store/currentUser';
import { ROUTES } from 'constants/routes';
import { getInfo } from 'api/user';
import { ActivityHelper } from '#shared/utils/activity';

const activity = new ActivityHelper(() => {
  getInfo().subscribe();
}, ['mousemove', 'keypress'], 150 * 1000);

export default function useAuthentication() {
  const dispatch = useDispatch();
  const location = useLocation();
  const initialized = useSelector(selectCurrentUserInitialized);
  const authenticated = useSelector(selectCurrentUserAuthenticated);
  const info = useSelector(selectCurrentUserInfo);
  const error = useSelector(selectCurrentUserError);

  const logout = useCallback(() => {
    window.location.assign(`${API_URL}/${API_APPENDIX}${ROUTES.LOGOUT}`);
  }, []);

  const login = useCallback(() => {
    window.location.assign(`${API_URL}/${API_APPENDIX}${ROUTES.KONG_HOME}`);
  }, []);

  const hasRealmRole = useCallback(
    (role: string): boolean => (info?.roles ? info.roles.some((r) => r.startsWith(role)) : false),
    [info?.roles],
  );

  const hasResourceRole = (role: string) => Boolean(role);

  useEffect(() => {
    if ((!initialized) || (authenticated && !info)) {
      dispatch(getInfoRequest());
    }
  }, [authenticated, dispatch, info, initialized]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(getInfoRequest());
      }
    };
  }, [location, error, dispatch]);

  useEffect(() => {
    if (authenticated) {
      activity.enable();
    } else {
      activity.disable();
    }
  }, [authenticated]);

  return {
    login,
    logout,
    hasRealmRole,
    hasResourceRole,
    initialized,
    authenticated,
    info,
    error,
  };
}
