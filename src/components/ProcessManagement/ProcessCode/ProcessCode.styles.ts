import { Theme, createStyles } from '@material-ui/core';

const styles = ({
  colors,
  spacing,
  typography,
  borders,
}: Theme) => createStyles({
  root: {
    padding: `0 ${spacing(5)}px`,
    marginBottom: spacing(13),
    display: 'flex',
    flexDirection: 'column',
    maxHeight: `calc(100vh - ${spacing(45)}px)`,
  },
  code: {
    marginTop: spacing(1),
    border: `1px solid ${colors.inputs.inputField.enabled.stroke}`,
    borderRadius: borders.radius1,
    overflowY: 'auto',
    '& textarea': {
      ...typography.textRegular,
    },
    '& .MuiInput-underline:before': {
      display: 'none',
    },
  },
});

export default styles;
