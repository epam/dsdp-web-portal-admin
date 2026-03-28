import { Theme, createStyles } from '@material-ui/core';

const styles = ({ colors, typography }: Theme) => createStyles({
  root: {
    '&, &:link, &:visited, &:hover, &:active': {
      ...typography.accentTiny,
      color: colors.controls.buttonText.enabled.name,
      textDecoration: 'inherit',
      fontWeight: 'inherit',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: 'fit-content',

      '& svg': {
        fill: colors.controls.buttonText.enabled.icon,
      },
    },
  },
});

export default styles;
