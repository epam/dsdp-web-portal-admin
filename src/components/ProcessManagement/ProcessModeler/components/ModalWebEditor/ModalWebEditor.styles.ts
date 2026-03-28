import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  modalHeader: {
    padding: `${spacing(1)}px ${spacing(3)}px ${spacing(1)}px ${spacing(5)}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnGroupRoot: {
    padding: `${spacing(3)}px ${spacing(3)}px ${spacing(3)}px ${spacing(5)}px`,
    display: 'inline-flex',
    '& > *:not(:last-child)': {
      marginRight: spacing(3),
    },
  },
  title: {
    marginTop: spacing(5),
    marginBottom: spacing(4),
  },
});

export default styles;
