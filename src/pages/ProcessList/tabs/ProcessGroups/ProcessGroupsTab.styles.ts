import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  root: {
    marginTop: spacing(6),

    '& .serviceCardArrowForward': {
      display: 'none',
    },
  },
  actions: {
    display: 'flex',
    gap: spacing(3),
    marginBottom: spacing(6),
  },
  actionsWrapper: {
    marginBottom: spacing(5),
  },
  groupActionsWrapper: {
    marginBottom: spacing(1),
  },
});

export default styles;
