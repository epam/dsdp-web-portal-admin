import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  form: {
    width: spacing(100),
    marginBottom: spacing(5),
  },
  textField: {
    marginTop: spacing(4),
  },
  title: {
    marginTop: spacing(8),
  },
  description: {
    marginTop: spacing(3),
  },
  btnSubmit: {
    marginTop: spacing(9),
  },
  radioGroup: {
    marginTop: spacing(5),
  },
});

export default styles;
