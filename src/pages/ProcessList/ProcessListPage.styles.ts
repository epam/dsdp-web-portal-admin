import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  nowrap: {
    marginTop: spacing(6),
    whiteSpace: 'nowrap',
  },
});

export default styles;
