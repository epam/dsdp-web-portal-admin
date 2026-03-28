import { createStyles, Theme } from '@material-ui/core';

const styles = ({ colors, spacing }: Theme) => createStyles({
  title: {
    marginTop: spacing(3),
    marginBottom: spacing(2),
    padding: spacing(2),
    color: colors.text.secondary,
  },
  link: {
    marginBottom: spacing(1),
    '& a': {
      height: spacing(8),
    },
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

export default styles;
