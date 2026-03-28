import React from 'react';
import CommonLayout from 'components/Layouts/CommonLayout';
import useVersion from 'hooks/useVersion';
import { isMaster as isMasterVersion } from 'utils/versions';
import { useSelector } from 'react-redux';
import {
  selectCandidateIsLoading,
  selectMasterIsLoading,
  selectCandidateChangesIsLoading,
  selectRebaseCandidateIsLoading,
} from 'store/versions';
import Master from './components/Master';
import Candidate from './components/Candidate';

function HomePage() {
  const { versionId } = useVersion();
  const isLoadingMaster = useSelector(selectMasterIsLoading);
  const isLoadingCandidate = useSelector(selectCandidateIsLoading);
  const isMaster = isMasterVersion(versionId);
  const isLoadingChanges = useSelector(selectCandidateChangesIsLoading);
  const isLoadingRebase = useSelector(selectRebaseCandidateIsLoading);
  const isLoading = isLoadingMaster || isLoadingCandidate || isLoadingChanges || isLoadingRebase;

  return (
    <CommonLayout isLoading={isLoading}>
      {isMaster && <Master />}
      {!isMaster && <Candidate />}
    </CommonLayout>
  );
}

export default HomePage;
