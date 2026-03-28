import { createStyles, Theme } from '@material-ui/core';

const styles = ({ spacing }: Theme) => createStyles({
  form: {
    maxWidth: spacing(100),
  },
  mb1: {
    marginBottom: spacing(1),
  },
  mt6: {
    marginTop: spacing(6),
  },
});

export default styles;
