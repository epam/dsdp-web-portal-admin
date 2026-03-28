import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  description: {
    marginTop: spacing(4),
    marginBottom: spacing(5),
  },
  info: {
    marginTop: spacing(5),
    marginRight: spacing(8),
  },
  label: {
    color: colors.text.secondary,
  },
  checks: {
    marginTop: spacing(4),
  },
  buttons: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, auto)',
    columnGap: spacing(4),
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing(5),
  },
  buttonItem: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
    '&:last-child': {
      marginLeft: spacing(4),
    },
  },
  changesTitle: {
    marginTop: spacing(8),
  },
  changesDescription: {
    marginTop: spacing(3),
    marginBottom: spacing(5),
  },
  menuItem: {
    paddingTop: spacing(1),
    paddingBottom: spacing(1),
  },
});

export default styles;
