import React from 'react';
import { makeStyles } from '@material-ui/core';
import Typography from '#web-components/components/Typography';
import Grid from '#web-components/components/Grid';
import styles from './ComponentError.styles';

export interface ComponentErrorProps {
  icon: React.ReactElement;
  text: string;
}

const useStyles = makeStyles(styles, { name: 'ComponentError' });

export default function ComponentError({ icon, text }: ComponentErrorProps) {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item desktopS={7}>
        {icon}
        <Typography variant="textRegular" className={classes.errorText}>
          {text}
        </Typography>
      </Grid>
    </Grid>
  );
}
