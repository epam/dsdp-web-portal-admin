import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    paddingRight: spacing(5),
    paddingLeft: spacing(5),
  },
  title: {
    paddingTop: spacing(21),
  },
  caption: {
    marginTop: spacing(4),
    marginBottom: spacing(9),
    display: 'block',
  },
});

export default styles;
