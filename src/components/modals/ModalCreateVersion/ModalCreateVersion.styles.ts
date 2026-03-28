import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  modalDescription: {
    marginTop: spacing(7),
    marginBottom: spacing(5),
  },
  input: {
    '&:first-of-type': {
      marginBottom: spacing(5),
    },
  },
});

export default styles;
