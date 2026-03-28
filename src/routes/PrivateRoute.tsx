import React from 'react';
import {
  Navigate, Outlet,
} from 'react-router';
import { ROUTES } from 'constants/routes';
import useAuthentication from 'hooks/useAuthentication';

interface PrivateRouteProps {
  roles: string[];
}

const ANY_ROLE_ALLOWED = '*';

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles }) => {
  const authentication = useAuthentication();
  const isAuthenticated = (): boolean => authentication.authenticated;

  const isAuthorized = (rolesToCheck: string[]): boolean => {
    return rolesToCheck.some((r) => (r === ANY_ROLE_ALLOWED || authentication.hasRealmRole(r)));
  };

  if (isAuthenticated()) {
    return isAuthorized(roles)
      ? <Outlet />
      : <Navigate to={{ pathname: ROUTES.FORBIDDEN }} replace />;
  }

  return (
    <Navigate to={ROUTES.LOGIN} replace />
  );
};

export default PrivateRoute;
