import { createStyles, Theme } from '@material-ui/core/styles';

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
});

export default styles;
