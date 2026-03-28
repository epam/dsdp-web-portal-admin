import { createStyles, Theme } from '@material-ui/core';

const styles = ({ spacing, colors, typography }: Theme) => createStyles({
  box: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: '1fr 168px',
    gridTemplateRows: 'auto auto',
    gridGap: spacing(3),
  },
  chip: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
  },
  input: {
    gridColumn: 1,
    gridRow: 1,
  },
  btn: {
    gridColumn: 2,
    gridRow: 1,
  },
  roles: {
    marginTop: spacing(6),
  },
  roleLabel: {
    ...typography.textTinyCompact,
    color: colors.inputs.label.name,
  },
});

export default styles;
