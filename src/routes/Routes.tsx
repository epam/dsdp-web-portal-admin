import React from 'react';
import {
  Route, RouterProvider, createBrowserRouter, createRoutesFromElements, redirect, Outlet,
  useRouteError,
} from 'react-router';
import NavigationListener from '#shared/utils/NavigationListener';
import { ROUTES } from 'constants/routes';
import { X_PATH } from 'constants/xPath';
import useAuthentication from 'hooks/useAuthentication';
import { getRoutePathWithVersion } from 'utils/versions';
import Login from 'pages/Login';
import FormList from 'pages/FormList';
import CreateForm from 'pages/CreateForm';
import NotFoundPage from 'pages/NotFound';
import ErrorPage from 'pages/Error';
import EditForm from 'pages/EditForm';
import EditProcess from 'pages/EditProcess';
import Users from 'pages/UserList';
import ImportUsersSuccess from 'pages/ImportUsersSuccess';
import HomePage from 'pages/Home';
import ProcessListPage from 'pages/ProcessList';
import CreateProcess from 'pages/CreateProcess';
import GlobalSettings from 'pages/GlobalSettings';
import Forbidden from 'pages/Forbidden';
import { ROLES } from 'constants/roles';
import Loader from 'components/Loader';
import I18nList from 'pages/I18nList';
import Notifications from 'components/Notifications';
import { MASTER_VERSION_ID } from 'constants/common';
import PrivateRoute from './PrivateRoute';
import { isAvoidAuth } from '../api';
import '#shared/utils/ensureRouterBaseName';

const RootLayout: React.FC = () => {
  const { initialized, error } = useAuthentication();

  if (!initialized) {
    return <Loader show data-xpath={X_PATH.loader} />;
  }

  if (!isAvoidAuth && error) {
    return <ErrorPage />;
  }

  return (
    <>
      <Notifications />
      <Loader show={false} data-xpath={X_PATH.loader} />
      <NavigationListener />
      <Outlet />
    </>
  );
};

const BubbleError = () => {
  const error = useRouteError();
  throw error;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />} errorElement={<BubbleError />}>
      <Route
        path="/"
        loader={({ params }) => {
          return redirect(getRoutePathWithVersion(ROUTES.HOME, params.versionId || MASTER_VERSION_ID));
        }}
      />
      <Route
        path={ROUTES.KONG_HOME}
        loader={({ params }) => redirect(getRoutePathWithVersion(ROUTES.HOME, params.versionId || MASTER_VERSION_ID))}
      />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GLOBAL_SETTINGS} element={<GlobalSettings />} />
        <Route path={ROUTES.FORM_LIST} element={<FormList />} />
        <Route path={ROUTES.PROCESS_LIST} element={<ProcessListPage />} />
        <Route path={ROUTES.CREATE_FORM} element={<CreateForm />} />
        <Route path={ROUTES.EDIT_FORM} element={<EditForm />} />
        <Route path={ROUTES.READ_ONLY_PREVIEW_FORM} element={<EditForm />} />
        <Route path={ROUTES.EDIT_PROCESS} element={<EditProcess />} />
        <Route path={ROUTES.READ_ONLY_PROCESS} element={<EditProcess />} />
        <Route path={ROUTES.CREATE_PROCESS} element={<CreateProcess />} />
        <Route path={ROUTES.USERS} element={<Users />} />
        <Route path={ROUTES.IMPORT_USERS_SUCCESS} element={<ImportUsersSuccess />} />
        <Route path={ROUTES.I18N_LIST} element={<I18nList />} />
      </Route>
      <Route element={<PrivateRoute roles={['*']} />}>
        <Route path={ROUTES.FORBIDDEN} element={<Forbidden />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
  {
    basename: import.meta.env.BASE_URL,
  },
);

const Routes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
