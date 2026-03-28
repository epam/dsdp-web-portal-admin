import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    maxWidth: spacing(100),
    marginTop: spacing(9),
  },
  errorText: {
    marginTop: spacing(3),
  },
});

export default styles;
