import { createStyles } from '@material-ui/core';

const styles = () => createStyles({
  root: {
    textAlign: 'right',
    textWrap: 'nowrap',

    '& button': {
      margin: 0,
    },
  },
});

export default styles;
