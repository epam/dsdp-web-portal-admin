import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation, Trans } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { Box, makeStyles } from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import DescriptionIcon from '@material-ui/icons/Description';
import CloseIcon from '@material-ui/icons/Close';
import {
  sendImportFileRequest,
} from 'store/users';
import { selectFileIsLoading, selectDropzoneError, selectImportUsersFileInfo } from 'store/users/selectors';
import {
  sendImportFileClean, startImportRequest, deleteImportFileRequest, getImportInfoRequest,
} from 'store/users/slice';
import { X_PATH } from 'constants/xPath';
import useVersion from 'hooks/useVersion';

import IconButton from '#web-components/components/IconButton';
import InlineButton from '#web-components/components/InlineButton';
import Button from '#web-components/components/Button';
import Typography from '#web-components/components/Typography';
import { NotificationWarningIcon } from '#web-components/components/Icons';
import DescriptionBox from '#web-components/components/DescriptionBox';

import styles from './ImportForm.styles';

export interface FileInfo {
  name: string;
  size: string;
}

const BYTES_IN_MB = 1048576;
const MAX_FILE_MB_SIZE = 30;
const FILE_TYPE = 'text/csv';

const useStyles = makeStyles(styles, { name: 'ImportForm' });

export default function ImportForm() {
  const { t } = useTranslation('pages', { keyPrefix: 'importUsers' });
  const classes = useStyles();
  const dispatch = useDispatch();
  const { versionId } = useVersion();
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [localError, setLocalError] = useState(null);
  const error = useSelector(selectDropzoneError);
  const isFileLoaing = useSelector(selectFileIsLoading);
  const uploadedFileInfo = useSelector((selectImportUsersFileInfo));

  const getSizeinBb = (size: number | string) => {
    const sizeInMB = +size / BYTES_IN_MB;

    return sizeInMB > 1 ? sizeInMB.toFixed(0) : '<1';
  };

  const removeFile = useCallback((): void => {
    if (!uploadedFileInfo?.id) {
      return;
    }
    dispatch(deleteImportFileRequest(uploadedFileInfo.id));
  }, [dispatch, uploadedFileInfo]);

  const onSubmit = useCallback((): void => {
    dispatch(startImportRequest({ versionId }));
  }, [dispatch, versionId]);

  // eslint-disable-next-line consistent-return
  const onDrop = useCallback(([file]) => {
    dispatch(sendImportFileClean());

    if ((+file.size / BYTES_IN_MB) > MAX_FILE_MB_SIZE) {
      return setLocalError(t('text.tooBigFileSize'));
    }

    if (file.type !== FILE_TYPE) {
      return setLocalError(t('text.invalidFileType'));
    }

    const formData = new FormData();
    const size = getSizeinBb(file.size);

    setFileInfo({ name: file.name, size });

    formData.append('file', file, file.name);
    dispatch(sendImportFileRequest(formData));
  }, [dispatch, t]);

  useEffect(() => {
    if (!isFileLoaing) {
      setFileInfo(null);
    } else {
      setLocalError(null);
    }
  }, [isFileLoaing]);

  useEffect(() => {
    dispatch(getImportInfoRequest());
  }, [dispatch]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box className={classes.wrapper}>
      <Typography className={classes.inconsistency}>
        <Trans ns="pages" i18nKey="importUsers.text.inconsistency" />
      </Typography>
      <Box className={classes.rule}>
        <NotificationWarningIcon size={36} />
        <Box className={classes.fileParams}>
          <Typography variant="textSmallCompact">{t('text.fileFormatCsv')}</Typography>
          <InlineButton
            to="/assets/Users_Upload.csv"
            classes={{
              link: classes.fileFormatIconWithLabel,
            }}
            download={t('text.fileNameCsv')}
            type="text/csv"
            target="_blank"
            rel="noreferrer"
            size="small"
            leftIcon={<GetAppIcon className={classes.keyCloakIcon} />}
          >
            <Typography variant="accentTiny">{t('text.fileNameCsv')}</Typography>
          </InlineButton>
          <InlineButton
            to="/assets/Users_Upload_Explanation.pdf"
            classes={{
              link: classes.fileFormatIconWithLabel,
            }}
            download={t('text.fileNamePdf')}
            type="text/pdf"
            target="_blank"
            rel="noreferrer"
            size="small"
            leftIcon={<DescriptionIcon className={classes.keyCloakIcon} />}
          >
            <Typography variant="accentTiny">{t('text.fileNamePdf')}</Typography>
          </InlineButton>
        </Box>
      </Box>
      <Typography className={classes.loadOfficials}>{t('text.loadOfficials')}</Typography>
      <Box className={classes.dropZoneCaption}>
        <Typography variant="accentRegular">{t('text.file')}</Typography>
        <Typography variant="accentRegular">{t('text.size')}</Typography>
      </Box>
      {uploadedFileInfo?.id
        ? (
          <Box className={classes.fileZone}>
            <IconButton onClick={removeFile}>
              <CloseIcon />
            </IconButton>
            <Box className={classes.fileInfo}>
              <Typography className={classes.dropZoneText} variant="h6">{
                uploadedFileInfo.name
              }
              </Typography>
              <Typography className={classes.dropZoneText} variant="h6">
                {getSizeinBb(uploadedFileInfo.size)} MB
              </Typography>
            </Box>
          </Box>
        )
        : (
          <Box className={classes.dropZone} {...getRootProps()}>
            <input {...getInputProps()} />
            <Typography className={classes.dropZoneText}>{t('text.dropZoneText')}</Typography>
            <Typography className={classes.dropZoneSelectFile}>{t('text.dropZoneSelectFile')}</Typography>
          </Box>
        )}
      {(error?.message || localError)
        && <Typography variant="h7" className={classes.invalidFile}>{error?.message || localError}</Typography>}
      {isFileLoaing && fileInfo && (
      <>
        <Box className={classes.uploadingFileInfo}>
          <Typography variant="h7">{fileInfo.name}</Typography>
          <Typography variant="h7">{fileInfo.size} MB</Typography>
        </Box>
        <Box className={classes.uploadingFile}>
          <Typography variant="accentRegular">{t('text.uploadingFile')}</Typography>
        </Box>
      </>
      )}
      <Box className={classes.fileFormatSize}>
        <DescriptionBox description={t('text.fileFormatSize')} />
      </Box>
      <Button
        className={classes.startImport}
        data-xpath={X_PATH.startImportButton}
        onClick={onSubmit}
        size="large"
      >
        {t('actions.startImport')}
      </Button>
    </Box>
  );
}
