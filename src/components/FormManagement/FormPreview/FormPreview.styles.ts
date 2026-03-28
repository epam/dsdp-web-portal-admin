import { createStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  root: {
    maxWidth: theme.breakpoints.values.desktopL,
  },
});

export default styles;
