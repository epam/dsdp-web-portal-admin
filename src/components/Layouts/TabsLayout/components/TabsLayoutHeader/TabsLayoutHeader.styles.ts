import { createStyles, Theme } from '@material-ui/core/styles';

const maxWidthRightSection = '665px';

const styles = ({ spacing, colors }: Theme) => createStyles({
  right: {
    display: 'flex',
    marginLeft: 'auto',
    alignItems: 'center',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    width: `calc(100% - ${maxWidthRightSection})`,
  },
  editModeSwitchText: {
    marginLeft: spacing(1),
    marginRight: spacing(6),
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: spacing(3),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: spacing(5),
    paddingRight: spacing(5),
  },
  navbar: {
    '& .MuiDivider-root': {
      background: colors.layout.divider700,
    },
  },
});

export default styles;
