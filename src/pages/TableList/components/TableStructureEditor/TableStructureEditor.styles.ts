import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  box: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing(9),
    paddingBottom: spacing(6),
  },
  modalBox: {
    padding: `${spacing(3)}px ${spacing(3)}px ${spacing(3)}px ${spacing(5)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    display: 'inline-flex',
    padding: spacing(1),
  },
  btnGroupRoot: {
    '& > *:not(:last-child)': {
      marginRight: spacing(3),
    },
  },
  errorBox: {
    marginTop: spacing(10),
  },
  errorText: {
    marginTop: spacing(3),
  },
  title: {
    marginTop: spacing(5),
    marginBottom: spacing(4),
  },
});

export default styles;
