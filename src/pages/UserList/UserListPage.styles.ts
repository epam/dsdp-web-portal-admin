import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ colors, spacing }: Theme) => createStyles({
  description: {
    marginTop: `${spacing(3)}px`,
    marginBottom: `${spacing(6)}px`,
    maxWidth: spacing(100),
  },
  addUsersRegistry: {
    marginTop: `${spacing(8)}px`,
  },
  lookingResult: {
    marginTop: `${spacing(4)}px`,
  },
  kibanaLink: {
    textDecoration: 'underline',
    fontWeight: 'bold',
    color: colors.text.primary,
  },
});

export default styles;
