import { createStyles, Theme } from '@material-ui/core';

const styles = ({ colors, spacing }: Theme) => createStyles({
  root: {
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'space-between',

    '& button': {
      margin: 0,
    },
  },
  menuItem: {
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
