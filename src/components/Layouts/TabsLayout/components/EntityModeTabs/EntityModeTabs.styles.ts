import { createStyles, Theme } from '@material-ui/core';

const styles = ({ colors, spacing, shadow }: Theme) => createStyles({
  container: {
    minHeight: spacing(12),
    borderRadius: spacing(1),
    padding: `${spacing(1)}px ${spacing(3)}px`,
    boxShadow: shadow.dropShadow400,
    display: 'flex',
    alignItems: 'center',
    marginTop: spacing(3),
    marginBottom: spacing(8),
  },
  modeName: {
    color: colors.text.secondary,
  },
  entityName: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  formNameContainer: {
    overflow: 'hidden',
  },
  tabsBar: {
    display: 'flex',
    alignItems: 'center',
  },
  menu: {
    marginLeft: spacing(5),
  },
  tabsRoot: {},
});

export default styles;
