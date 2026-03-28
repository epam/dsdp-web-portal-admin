import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  actions: {
    display: 'flex',
    alignItems: 'end',
    marginTop: spacing(8),
    marginBottom: spacing(3),
  },
  downloadButton: {
    marginLeft: 0,
    fontSize: 0,
  },
});

export default styles;
