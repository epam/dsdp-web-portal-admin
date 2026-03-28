import { Theme, createStyles } from '@material-ui/core';

const styles = ({ spacing }: Theme) => createStyles({
  actions: {
    display: 'flex',
    alignItems: 'end',
    marginTop: spacing(8),
    marginBottom: spacing(3),
  },
  title: {
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
  },
  hidden: {
    visibility: 'hidden',
    marginTop: spacing(4),
    marginBottom: 0,
  },
  search: {
    width: spacing(32),
  },
});

export default styles;
