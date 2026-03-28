import { createStyles, Theme } from '@material-ui/core';

const styles = ({
  colors,
  spacing,
  borders,
  flags,
}: Theme) => createStyles({
  wrapper: {
    maxWidth: spacing(100),
    paddingBottom: `${spacing(5)}px`,
  },
  inconsistency: {
    marginTop: `${spacing(6)}px`,
  },
  rule: {
    display: 'flex',
    padding: `${spacing(3)}px`,
    marginTop: `${spacing(6)}px`,
    borderRadius: colors.pageElements.flyOutNotifications.corner,
    backgroundColor: colors.pageElements.flyOutNotifications.backgroundWarning,
    outline: `1px solid ${colors.pageElements.flyOutNotifications.strokeWarning}`,
    fontWeight: 'normal',
  },
  fileParams: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: `${spacing(4)}px`,
  },
  fileFormatCsv: {
    marginTop: `${spacing(1.5)}px`,
  },
  fileFormatIconWithLabel: {
    marginTop: `${spacing(2)}px`,
  },
  loadOfficials: {
    marginTop: `${spacing(4)}px`,
  },
  dropZoneCaption: {
    marginTop: `${spacing(2)}px`,
    height: '48px',
    display: 'flex',
    padding: `0 ${spacing(7)}px`,
    justifyContent: 'space-between',
    alignItems: 'center',
    color: colors.pageElements.table.headerCell.enabled.name,
    background: colors.pageElements.table.background,
    border: flags.boxStyle !== 'stroke' ? `2px solid ${colors.inputs.fileUpload.dropArea.enabled.border}` : 'none',
    borderBottom: `2px solid ${colors.inputs.fileUpload.dropArea.enabled.border}`,
    borderRadius: colors.pageElements.flyOutNotifications.corner,
  },
  dropZone: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: `${spacing(2)}px`,
    padding: `${spacing(3)}px ${spacing(4)}px`,
    border: `2px dashed ${colors.inputs.fileUpload.dropArea.enabled.border}`,
    cursor: 'pointer',
    borderRadius: borders.radius1,

    '&:hover': {
      borderColor: colors.inputs.fileUpload.dropArea.hovered.border,
    },
  },
  fileZone: {
    display: 'flex',
    alignItems: 'center',
    padding: `${spacing(3)}px ${spacing()}px`,
    borderBottom: `2px solid ${colors.inputs.fileUpload.dropArea.enabled.border}`,
  },
  fileInfo: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    padding: `0px ${spacing(6)}px 0px ${spacing(4)}px`,
  },
  dropZoneText: {
    textAlign: 'center',
  },
  dropZoneSelectFile: {
    textAlign: 'center',
    color: colors.navigation.textLink.enabled.text,
    borderBottom: `2px solid ${colors.navigation.textLink.enabled.text}`,
  },
  invalidFile: {
    marginTop: `${spacing(1.5)}px`,
    color: colors.text.error,
  },
  uploadingFileInfo: {
    marginTop: `${spacing(2)}px`,
    display: 'flex',
    justifyContent: 'space-between',
  },
  uploadingFile: {
    marginTop: spacing(1),
    padding: `${spacing(1 / 2)}px ${spacing(1)}px`,
    backgroundColor: colors.base.primary,
  },
  fileFormatSize: {
    marginTop: `${spacing(2)}px`,
  },
  keyCloakIcon: {
    fontSize: 18,

    '& path': {
      fill: colors.text.accentBright,
    },
  },
  startImport: {
    marginTop: `${spacing(8)}px`,
  },
});

export default styles;
