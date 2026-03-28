import React, {
  useEffect, useMemo, useCallback, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Box, makeStyles, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import {
  getCandidateRequest,
  selectCandidate,
  getCandidateChangesRequest,
  selectCandidateChanges,
  selectChangesRebased,
  revertChangeRequest,
} from 'store/versions';
import {
  mergeCandidateRequest,
  abandonCandidateRequest,
  rebaseCandidateRequest,
  rebaseCandidateClean,
} from 'store/versions/slice';
import useVersion from 'hooks/useVersion';
import { X_PATH } from 'constants/xPath';
import CheckListItem from 'components/CheckListItem';
import { VersionCheckResult, VersionsChange, VersionChangeType } from 'types/versions';
import ColoredBox from '#web-components/components/ColoredBox';
import Typography from '#web-components/components/Typography';
import { formatUTCDateTime } from '#web-components/utils';
import InlineButton from '#web-components/components/InlineButton';
import {
  CloseIcon, LoginIcon, SyncIcon,
} from '#web-components/components/Icons';
import ConfirmModal from '#web-components/components/ConfirmModal';
import DropdownMenu from '#web-components/components/DropdownMenu';
import styles from './Candidate.styles';

import CandidateChanges from '../CandidateChanges';

const useStyles = makeStyles(styles, { name: 'Candidate' });

export default function Candidate() {
  const dispatch = useDispatch();
  const candidate = useSelector(selectCandidate);
  const changes = useSelector(selectCandidateChanges);
  const { versionId } = useVersion();
  const classes = useStyles();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'home' });
  const checked = useSelector(selectChangesRebased);
  const [forceMergeDialogState, setForceMergeDialogSate] = useState(false);
  const conflictsStatus = useMemo(() => {
    if (!candidate?.hasConflicts) {
      return VersionCheckResult.SUCCESS;
    }
    if (!checked && candidate.hasConflicts) {
      return VersionCheckResult.PENDING;
    }
    return VersionCheckResult.FAILED;
  }, [checked, candidate?.hasConflicts]);

  const hasChanges = useMemo(() => {
    return changes.reduce((acc, [, change]) => acc || !!change.length, false);
  }, [changes]);

  const isValidationSuccess = useMemo(() => {
    return candidate?.validations?.every((validation) => validation.result === VersionCheckResult.SUCCESS);
  }, [candidate?.validations]);

  const mergeAllowed = useMemo(() => {
    return conflictsStatus === VersionCheckResult.SUCCESS;
  }, [conflictsStatus]);

  useEffect(() => {
    dispatch(getCandidateRequest(versionId));
    dispatch(getCandidateChangesRequest(versionId));
    return () => {
      dispatch(rebaseCandidateClean());
    };
  }, [dispatch, versionId]);

  const mergeChanges = useCallback(() => {
    dispatch(mergeCandidateRequest(versionId));
  }, [dispatch, versionId]);

  const revertChange = useCallback((changeType: VersionChangeType, changeItem: VersionsChange) => {
    dispatch(revertChangeRequest({ changeType, changeItem, versionId }));
  }, [dispatch, versionId]);

  const handleMergeChanges = useCallback(() => {
    if (isValidationSuccess) {
      mergeChanges();
      return;
    }
    setForceMergeDialogSate(true);
  }, [isValidationSuccess, mergeChanges]);

  const handleForceMerge = useCallback(() => {
    setForceMergeDialogSate(false);
    mergeChanges();
  }, [mergeChanges]);

  const abandonChanges = () => {
    dispatch(abandonCandidateRequest(versionId));
  };

  const rebaseChanges = () => {
    dispatch(rebaseCandidateRequest(versionId));
  };

  const openVCSLink = useCallback(() => {

  const url = `${ENVIRONMENT_VARIABLES.vcsUrl}/-/merge_requests/${versionId}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  }, [versionId]);

  const ALLOWED = new Set([
    "changedForms",
    "changedBusinessProcesses",
  ]);

  return (
    <>
      <ConfirmModal
        isOpen={forceMergeDialogState}
        title={t('forceMergeDialog.title')}
        confirmationText={t('forceMergeDialog.text')}
        submitText={t('forceMergeDialog.okButton')}
        cancelText={t('forceMergeDialog.cancelButton')}
        onSubmit={handleForceMerge}
        onOpenChange={setForceMergeDialogSate}
      />
      <ColoredBox>
        <Typography variant="h2">{candidate?.name}</Typography>

        <Box display="flex">
          {candidate?.creationDate && (
            <Box className={classes.info}>
              <Typography variant="textTiny" className={classes.label}>{t('text.creationDate')}</Typography>
              <Typography variant="textRegular">{formatUTCDateTime(candidate.creationDate, i18n.language)}</Typography>
            </Box>
          )}

          {candidate?.latestRebase && (
            <Box className={classes.info}>
              <Typography variant="textTiny" className={classes.label}>{t('text.latestRebase')}</Typography>
              <Typography variant="textRegular">{formatUTCDateTime(candidate.latestRebase, i18n.language)}</Typography>
            </Box>
          )}
        </Box>

        {candidate?.description && (
          <Box className={classes.description}>
            <Typography variant="textTiny" className={classes.label}>{t('text.descriptionOfChange')}</Typography>
            <Typography variant="textRegular">{candidate.description}</Typography>
          </Box>
        )}
        <CheckListItem
          className={classes.checks}
          status={conflictsStatus}
          successMessage={t('text.noConflictsMessage')}
          failedMessage={t('text.hasConflictsMessage')}
          pendingMessage={t('text.notCheckedMessage')}
        />
        {candidate?.validations?.map((validation) => (
          <CheckListItem
            key={validation.type}
            className={classes.checks}
            status={validation.result}
            successMessage={t(`${validation.type}.success`)}
            failedMessage={t(`${validation.type}.failed`)}
            pendingMessage={t(`${validation.type}.pending`)}
          />
        ))}
        <Box className={classes.buttons}>
          <Box className={classes.buttonItem}>
            <InlineButton size="medium" onLinkClick={rebaseChanges} leftIcon={<SyncIcon />}>
              {t('text.rebaseChanges')}
            </InlineButton>
          </Box>
          <Box className={classes.buttonItem}>
            <InlineButton
              size="medium"
              onLinkClick={handleMergeChanges}
              disabled={!mergeAllowed}
              leftIcon={<LoginIcon />}
              data-xpath={mergeAllowed ? X_PATH.applyVersion : X_PATH.applyVersionDisabled}
            >
              {t('text.mergeChanges')}
            </InlineButton>
          </Box>
          <Box className={classes.buttonItem}>
            <InlineButton size="medium" onLinkClick={abandonChanges} leftIcon={<CloseIcon />}>
              {t('text.abandonChanges')}
            </InlineButton>
          </Box>
          <Box className={classes.buttonItem}>
            <DropdownMenu
              triggerElement={<Typography variant="h7">{t('text.links')}</Typography>}
            >
              <MenuItem
                onClick={openVCSLink}
                className={classes.menuItem}
              >
                {t('actions.openGerrit')}
              </MenuItem>
            </DropdownMenu>
          </Box>
        </Box>
      </ColoredBox>
      <Typography variant="h3" className={classes.changesTitle}>{t('text.changesLabel')}</Typography>
      <Typography variant="textRegular" className={classes.changesDescription}>
        {t('text.changesDescription')}
      </Typography>
      {hasChanges ? (
        <Box>
          {
            changes
            .filter(([key]) => ALLOWED.has(key))
            .map(([key, value]) => (
              value?.length
                ? (
                  <CandidateChanges
                    key={`${versionId}${key}`}
                    title={key}
                    data={value}
                    onRevert={revertChange}
                    dataXpath={`candidate-${key}`}
                  />
                )
                : null
            ))
          }
        </Box>
      )
        : (
          <Typography variant="textTiny" className={classes.label}>{t('text.noChanges')}</Typography>
        )}
    </>
  );
}
