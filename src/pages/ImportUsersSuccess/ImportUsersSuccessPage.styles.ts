import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  wrapper: {
    maxWidth: spacing(100),
    paddingTop: spacing(8),
  },
  kibanaLink: {
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: colors.text.primary,
  },
  clearlyButton: {
    marginTop: `${spacing(8)}px`,
  },
});

export default styles;
