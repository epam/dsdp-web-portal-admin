import { createStyles, Theme } from '@material-ui/core';

const styles = ({ colors, spacing, flags }: Theme) => createStyles({
  versionButton: {
    marginBottom: '-2px',
    borderBottom: '2px solid transparent',
    borderRadius: 0,
    '&:hover': {
      borderBottom: `2px solid ${colors.pageElements.versionMenu.hovered.stroke}`,
      background: 'none',
      '& button': {
        backgroundColor: 'transparent',
      },
    },
  },
  versionButtonText: {
    marginRight: spacing(2),
    textTransform: 'none',
    textAlign: 'left',
  },
  active: {
    borderImage: flags.boxStyle === 'stroke' ? colors.pageElements.versionMenu.pressed.stroke : 'none',
    borderBottom: flags.boxStyle !== 'stroke' ? `2px solid ${colors.pageElements.versionMenu.pressed.stroke}` : 'none',
    borderImageSlice: 1,
    borderBottomStyle: 'solid',
    borderBottomWidth: '2px',
  },
  currentVersion: {
    textTransform: 'none',
    color: colors.text.secondary,
  },
  arrowIcon: {
    marginRight: spacing(2),
  },
  arrowUp: {
    transform: 'rotate(180deg)',
  },
  paper: {
    marginTop: spacing(1),
    paddingTop: spacing(1),
    width: spacing(55),
    padding: 0,
  },
  version: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${spacing(1 / 2)}px ${spacing(2)}px`,
    whiteSpace: 'initial',
    overflowWrap: 'anywhere',
  },
  checkIcon: {
    width: spacing(4),
    height: spacing(4),
  },
  versionName: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    whiteSpace: 'initial',
    overflowWrap: 'anywhere',
  },
  selected: {
    '& .MuiTypography-root': {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
  menuSimpleBox: {
    margin: spacing(2),
  },
  secondaryText: {
    color: colors.text.secondary,
    whiteSpace: 'normal',
    marginTop: spacing(1),
  },
  scrolledBox: {
    maxHeight: `calc(100vh - ${spacing(25)}px)`,
    overflowY: 'auto',
    padding: `0px ${spacing(1)}px`,
  },
  divider: {
    opacity: 0.2,
    padding: `0px ${spacing(1)}px`,
  },
  menuBottomBox: {
    margin: spacing(1),
    padding: spacing(2),
    cursor: 'pointer',
    color: colors.pageElements.dropdownMenuOption.enabled.name,

    '&:hover': {
      color: colors.pageElements.dropdownMenuOption.hovered.name,
      backgroundColor: colors.pageElements.dropdownMenuOption.hovered.background,
    },
  },
  disabled: {
    '& button:hover': {
      backgroundColor: 'unset',
      cursor: 'unset',
    },
  },
});

export default styles;
