import { createStyles, Theme } from '@material-ui/core';

const styles = ({ spacing }: Theme) => createStyles({
  form: {
    maxWidth: spacing(100),
  },
  textField: {
    marginBottom: spacing(1),
  },
  margin: {
    marginTop: spacing(6),
  },
});

export default styles;
