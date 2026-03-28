import { Theme, createStyles } from '@material-ui/core';

const styles = ({ spacing }: Theme) => createStyles({
  nowrap: {
    marginTop: spacing(6),
    whiteSpace: 'nowrap',
  },
});

export default styles;
