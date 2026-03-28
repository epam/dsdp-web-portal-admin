import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  menuItem: {
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    paddingLeft: spacing(4),
  },
  menuDelete: {
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    paddingLeft: spacing(4),
    color: colors.text.error,
    '&:hover': {
      backgroundColor: colors.additional.red100,
    },
  },
  menuList: {
    width: spacing(35),
  },
});

export default styles;
