import { createStyles, Theme } from '@material-ui/core/styles';

const sideBarWidth = 240;
const sideBarWidthLg = 318;
const navBarHeight = 72;

const styles = ({ colors, breakpoints, spacing }: Theme) => createStyles({
  navbar: {
    height: navBarHeight,

    '& .MuiDivider-root': {
      background: colors.layout.divider700,
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingLeft: spacing(4),
    paddingRight: spacing(4),
  },
  sidebar: {
    width: sideBarWidth,
    backgroundColor: colors.layout.backgroundSecondary,
    padding: spacing(4),
    minHeight: `calc(100vh - ${navBarHeight}px)`,
    [breakpoints.up('desktopL')]: {
      width: sideBarWidthLg,
    },
  },
  container: {
    width: `calc(100% - ${sideBarWidth}px)`,
    padding: spacing(6),
    backgroundColor: colors.base.white,
  },
  maxWidth: {
    width: spacing(100),
  },
  link: {
    lineHeight: 0,
    marginBottom: spacing(3),
  },
  title: {
    color: colors.text.accent,
  },
  headerAction: {
    display: 'grid',
    gridTemplateColumns: '90px 1fr',
    gridColumnGap: spacing(4),
    alignItems: 'center',
  },
});

export default styles;
