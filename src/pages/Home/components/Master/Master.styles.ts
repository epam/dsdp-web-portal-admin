import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  description: {
    marginTop: spacing(4),
  },
  info: {
    marginTop: spacing(5),
  },
  label: {
    color: colors.text.secondary,
  },
  buttons: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing(5),
  },
  buttonItem: {
    padding: spacing(1),
  },
  menuItem: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
  },
  checks: {
    marginTop: spacing(5),
  },
});

export default styles;
