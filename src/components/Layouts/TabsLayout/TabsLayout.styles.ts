import { createStyles, Theme } from '@material-ui/core/styles';

const navBarHeight = 60;

const styles = ({ colors, spacing }: Theme) => createStyles({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    minHeight: `calc(100vh - ${navBarHeight}px)`,
    paddingTop: spacing(4),
    paddingRight: spacing(6),
    paddingLeft: spacing(6),
    backgroundColor: colors.base.white,
  },
  maxWidth: {
    width: spacing(100),
  },
  link: {
    lineHeight: 0,
    marginBottom: spacing(3),
  },
});

export default styles;
