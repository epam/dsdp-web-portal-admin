import { createStyles, Theme } from '@material-ui/core';

const styles = (theme: Theme) => createStyles({
  link: {
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
  conflictIcon: {
    marginLeft: theme.spacing(1),
  },
  cellAction: {
    marginTop: -theme.spacing(1),
  },
});

export default styles;
