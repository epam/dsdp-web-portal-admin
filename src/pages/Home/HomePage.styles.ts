import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    paddingTop: spacing(11),
  },
});

export default styles;
