import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  availableLanguagesLabel: {
    display: 'inline-flex',
    marginTop: spacing(8),
    marginBottom: spacing(3),
  },
  table: {
    width: spacing(126),
  },
});

export default styles;
