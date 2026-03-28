import { MASTER_VERSION_ID } from 'constants/common';
import { useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectVersionsList, selectVersionsListIsLoading, selectVersionsListIsLoaded, selectCreateCandidateIsLoading,
} from 'store/versions/selectors';
import { createVersionRequest } from 'store/versions';
import { CreateVersionParams } from 'types/versions';
import { ROUTES } from 'constants/routes';
import { getRoutePathWithVersion } from 'utils/versions';

export default function useVersion() {
  const dispatch = useDispatch();
  const params: Partial<{ versionId: string }> = useParams();
  const navigate = useNavigate();
  const versionsList = useSelector(selectVersionsList);
  const versionIsLoading = useSelector(selectVersionsListIsLoading);
  const versionCreateIsLoading = useSelector(selectCreateCandidateIsLoading);
  const versionIsLoaded = useSelector(selectVersionsListIsLoaded);

  const setVersion = useCallback((id: string) => {
    navigate(getRoutePathWithVersion(ROUTES.HOME, id));
  }, [navigate]);

  const createVersion = useCallback(<S>(args: CreateVersionParams<S>) => {
    const {
      data, path, state, nextAction,
    } = args;
    dispatch(createVersionRequest({
      data,
      path,
      state,
      nextAction,
    }));
  }, [dispatch]);

  const versionId = useMemo(() => {
    return params.versionId || MASTER_VERSION_ID;
  }, [params.versionId]);

  return {
    versionId,
    versionsList,
    versionIsLoading,
    versionCreateIsLoading,
    versionIsLoaded,
    setVersion,
    createVersion,
  };
}
