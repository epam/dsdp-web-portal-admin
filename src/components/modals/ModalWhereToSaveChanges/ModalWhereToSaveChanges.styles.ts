import { createStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  description: {
    marginBottom: theme.spacing(6),
  },
  link: {
    justifyContent: 'center',
    alignItems: 'inherit',
  },
  btn: {
    '& button': {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
  },
});

export default styles;
