import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  form: {
    maxWidth: spacing(100),
    paddingLeft: spacing(5),
    paddingRight: spacing(5),
  },
  textField: {
    marginBottom: spacing(1),
  },
  margin: {
    marginTop: spacing(6),
  },
  checkboxes: {
    marginTop: spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
});

export default styles;
