import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  readOnlyMessage: {
    marginTop: spacing(4),
  },
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
    marginTop: spacing(5),
    marginBottom: 0,
  },
  search: {
    width: spacing(42),
  },
});

export default styles;
