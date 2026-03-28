import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    maxWidth: spacing(100),
  },
});

export default styles;
