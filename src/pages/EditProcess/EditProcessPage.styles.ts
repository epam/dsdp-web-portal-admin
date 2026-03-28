import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  menuItem: {
    paddingTop: spacing(2),
    paddingBottom: spacing(2),
    paddingLeft: spacing(4),
    paddingRight: spacing(4),
  },
  menuItemDelete: {
    color: colors.text.error,
    '&:hover': {
      backgroundColor: colors.additional.red100,
    },
  },
  menuList: {
    minWidth: spacing(43),
  },
  menuDivider: {
    opacity: 0.2,
  },
});

export default styles;
