import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  title: {
    marginTop: spacing(13),
    marginBottom: spacing(8),
  },
  fixedWidthContent: {
    maxWidth: spacing(100),
  },
  message: {
    marginBottom: spacing(4),
  },
  description: {
    marginBottom: spacing(4),
    color: colors.text.secondary,
  },
  button: {
    marginTop: spacing(10),
  },
  backLink: {
    marginTop: spacing(4),
  },
  backTitle: {
    marginLeft: spacing(1),
  },
});

export default styles;
