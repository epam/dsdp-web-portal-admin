import { createStyles } from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    textAlign: 'right',
    gap: spacing(2),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    display: 'flex',
    margin: `${spacing(-1)}px 0px`,

    '& button': {
      margin: 0,
    },
  },
});

export default styles;
