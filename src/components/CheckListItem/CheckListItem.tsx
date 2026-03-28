import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { DoneIcon, ErrorIcon, SyncProblemIcon } from '#web-components/components/Icons';
import Typography from '#web-components/components/Typography';
import { VersionCheckResult } from 'types/versions';
import styles from './CheckListItem.styles';

type CheckListItemProps = {
  status: VersionCheckResult;
  successMessage: string;
  failedMessage: string;
  pendingMessage: string;
  className?: string;
};

const useStyles = makeStyles(styles, { name: 'CheckListItem' });

export default function CheckListItem({
  status, failedMessage, successMessage, className, pendingMessage,
}: CheckListItemProps) {
  const classes = useStyles();
  return (
    <Box display="flex" flexWrap="nowrap" className={className} alignItems="center">
      { status === VersionCheckResult.FAILED ? <ErrorIcon className={classes.icon} /> : null}
      { status === VersionCheckResult.SUCCESS ? <DoneIcon className={classes.icon} /> : null}
      { status === VersionCheckResult.PENDING ? <SyncProblemIcon className={classes.icon} /> : null}
      <Typography variant="textRegular">
        {status === VersionCheckResult.FAILED ? failedMessage : null}
        {status === VersionCheckResult.SUCCESS ? successMessage : null}
        {status === VersionCheckResult.PENDING ? pendingMessage : null}
      </Typography>
    </Box>
  );
}
