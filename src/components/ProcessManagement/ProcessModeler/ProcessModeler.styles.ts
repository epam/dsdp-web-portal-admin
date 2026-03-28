import { createStyles, Theme } from '@material-ui/core/styles';

const styles = ({ spacing, colors }: Theme) => createStyles({
  modeler: {
    position: 'relative',
    width: '100%',
    display: 'flex',
    height: `calc(100vh - ${spacing(35)}px)`,
    marginTop: `-${spacing(5)}px`,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  propertiesPanel: {
    width: spacing(65),
    borderLeft: `1px solid ${colors.base.grey500}`,
    overflow: 'auto',
    height: '100%',
  },
});

export default styles;
