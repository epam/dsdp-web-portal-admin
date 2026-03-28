import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  menu: {
    position: 'relative',
  },
  name: {
    position: 'relative',
    width: '100%',
    textTransform: 'inherit',
    padding: spacing(1),
    borderRadius: colors.navigation.accountMenu.corner,
  },
  enabled: {
    color: colors.navigation.accountMenu.enabled.text,
    '& path': {
      fill: colors.navigation.accountMenu.enabled.icon,
    },
    '&:hover': {
      background: colors.navigation.accountMenu.hovered.fill,
      color: colors.navigation.accountMenu.hovered.name,
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderBottom: `2px solid ${colors.navigation.accountMenu.hovered.stroke}`,
      },
    },
    '&:focus': {
      background: colors.navigation.accountMenu.focused.fill,
      color: colors.navigation.accountMenu.focused.name,
      '&:after': {
        content: '""',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderBottom: `2px solid ${colors.navigation.accountMenu.hovered.stroke}`,
      },
    },
  },
});

export default styles;
