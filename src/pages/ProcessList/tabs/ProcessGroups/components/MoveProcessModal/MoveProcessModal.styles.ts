import { createStyles, Theme } from '@material-ui/core/styles';

const styles = (theme: Theme) => createStyles({
  buttonBox: {
    width: '100%',
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(3),
    },
  },
  selectLabel: {
    marginTop: theme.spacing(5),
    color: theme.colors.text.secondary,
  },
  selectButton: {
    width: '100%',
    marginTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderRadius: 0,
    borderBottom: `2px solid ${theme.colors.layout.divider300}`,
    '& Button': {
      width: '100%',
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
  },
  selectButtonText: {
    width: '100%',
    marginRight: theme.spacing(3),
    textTransform: 'none',
    textAlign: 'left',
  },
  arrowIcon: {
    display: 'flex',
    marginRight: theme.spacing(3),
  },
  arrowUp: {
    transform: 'rotate(180deg)',
  },
  placeholder: {
    color: theme.colors.text.subtle,
  },
  paper: {
    marginLeft: theme.spacing(2),
    width: '100%',
    maxWidth: '100%',
    maxHeight: theme.spacing(30),
    overflowY: 'auto',
    padding: `0px ${theme.spacing(1)}px`,
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: theme.spacing(1),
    whiteSpace: 'initial',
    overflowWrap: 'anywhere',
    '&:hover': {
      backgroundColor: theme.colors.controls.options.hovered.hoverArea,
    },
  },
  menuSimpleBox: {
    margin: `${theme.spacing(3)}px ${theme.spacing(1)}px`,
  },
  secondaryText: {
    color: theme.colors.text.secondary,
    whiteSpace: 'normal',
    marginTop: theme.spacing(1),
  },
  divider: {
    opacity: 0.2,
    padding: `0px ${theme.spacing(1)}px`,
  },
});

export default styles;
