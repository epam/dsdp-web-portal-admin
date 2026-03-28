import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing }: Theme) => createStyles({
  paper: {
    maxWidth: spacing(164),
    width: spacing(164),
  },

  modal: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing(8),
    padding: spacing(10),
    '& > *': {
      width: '100%',
    },
  },
  modalFullScreen: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: `${spacing(3)}px ${spacing(6)}px`,
    '& > *': {
      width: '100%',
    },
  },

  modalHeaderFullScreen: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& button': {
      marginLeft: spacing(1),
    },
  },

  fullScreenBtn: {
    position: 'absolute',
    right: `${spacing(13)}px`,
    top: `${spacing(4)}px`,
  },

  closeModalBtn: {
    position: 'absolute',
    right: `${spacing(4)}px`,
    top: `${spacing(4)}px`,
  },

  existedLanguages: {
  },

  webEditor: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing(6),
    '& > *': {
      width: '100%',
    },
  },
  webEditorFullScreen: {
    paddingTop: spacing(6),
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: spacing(6),
    '& > *': {
      width: '100%',
    },
  },

  btnGroupRoot: {
    display: 'inline-flex',
    '& > *:not(:last-child)': {
      marginRight: spacing(3),
    },
  },
  btnGroupRootFullScreen: {
    paddingTop: spacing(3),
    display: 'inline-flex',
    '& > *:not(:last-child)': {
      marginRight: spacing(3),
    },
  },
});

export default styles;
