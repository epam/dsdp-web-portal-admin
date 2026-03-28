import { createStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  buttonBox: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(3),
    },
  },
});

export default styles;
