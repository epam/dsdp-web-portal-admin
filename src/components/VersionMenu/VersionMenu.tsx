import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Box, makeStyles } from '@material-ui/core';
import Check from '@material-ui/icons/Check';
import { MASTER_VERSION_ID } from 'constants/common';
import { getVersionsListRequest } from 'store/versions/slice';
import useVersion from 'hooks/useVersion';
import { isMaster as isMasterVersion } from 'utils/versions';
import Button, { ButtonVariants } from '#web-components/components/Button';
import MenuList from '#web-components/components/MenuList';
import MenuItem from '#web-components/components/MenuList/components/MenuItem';
import Popper from '#web-components/components/Popper';
import Divider from '#web-components/components/Divider';
import Typography from '#web-components/components/Typography';
import ArrowDropDownIcon from '#web-components/components/Icons/ArrowDropDownIcon';

import styles from './VersionMenu.styles';

interface VersionMenuProps {
  onCreateButtonClick: () => void,
  disabled?: boolean,
  dataXpath: {
    versionName: string
  }
}

const useStyles = makeStyles(styles, { name: 'VersionMenu' });

export default function VersionMenu({ onCreateButtonClick, disabled, dataXpath }: VersionMenuProps) {
  const {
    versionId,
    versionsList,
    setVersion,
  } = useVersion();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('components', { keyPrefix: 'versionMenu' });
  const classes = useStyles();
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const isMaster = isMasterVersion(versionId);

  const handleClick = () => {
    if (!disabled) {
      setOpen((prevStateOfOpen) => !prevStateOfOpen);
    }
  };
  const handleClose = () => {
    setOpen((prevStateOfOpen) => !prevStateOfOpen);
  };

  const handleChange = useCallback((id: string) => {
    setVersion(id);
    setOpen((prevStateOfOpen) => !prevStateOfOpen);
  }, [setVersion]);

  const createButtonHandler = useCallback(() => {
    setOpen((prevStateOfOpen) => !prevStateOfOpen);
    onCreateButtonClick();
  }, [onCreateButtonClick]);

  useEffect(() => {
    if (versionsList.length === 0) {
      dispatch(getVersionsListRequest());
    }
  }, [dispatch, versionsList.length]);

  useEffect(() => {
    if (open) {
      dispatch(getVersionsListRequest());
    }
  }, [dispatch, open]);

  return (
    <div>
      <Button
        variant={ButtonVariants.text}
        size="medium"
        className={clsx(disabled ? classes.disabled : classes.versionButton, { [classes.active]: open })}
        onClick={handleClick}
        buttonRef={anchorEl}
      >
        <Box className={classes.versionButtonText}>
          <Typography variant="h5">
            {i18n.t('text~appTitle')}
          </Typography>
          <Typography variant="textTiny" className={classes.currentVersion} data-xpath={dataXpath.versionName}>
            {isMaster
              ? t('text.masterVersion')
              : versionsList.find((version) => version.id === versionId)?.name}
          </Typography>
        </Box>
        {!disabled && <ArrowDropDownIcon className={clsx(open ? classes.arrowUp : undefined, classes.arrowIcon)} />}
      </Button>
      <Popper
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        placement="bottom-start"
      >
        <MenuList className={classes.paper}>
          <Box className={classes.scrolledBox}>
            <MenuItem
              onClick={() => handleChange(MASTER_VERSION_ID)}
              className={clsx(classes.version, isMaster ? classes.selected : undefined)}
            >
              <Box><Typography variant="textRegular">{t('text.masterVersion')}</Typography></Box>
              {isMaster ? <Box className={classes.checkIcon}><Check /></Box> : null}
            </MenuItem>
            <Box className={classes.menuSimpleBox}>
              <Typography variant="textSmallCompact" className={classes.secondaryText}>
                {t('text.versionRequest')}
              </Typography>
            </Box>
            {
              versionsList.length
                ? versionsList.map(({ id, name, description }) => (
                  <MenuItem
                    key={id}
                    onClick={() => handleChange(id)}
                    className={clsx(classes.version, versionId === id ? classes.selected : undefined)}
                  >
                    <Box className={classes.versionName}>
                      <Typography>
                        {name}
                      </Typography>
                      {description && (
                        <Typography variant="textTiny" className={classes.secondaryText}>
                          {description}
                        </Typography>
                      )}
                    </Box>
                    {versionId === id ? <Box className={classes.checkIcon}><Check /></Box> : null}
                  </MenuItem>
                ))
                : (
                  <Box className={classes.menuSimpleBox}>
                    <Typography variant="textSmall">
                      {t('text.anyVersion')}
                    </Typography>
                  </Box>
                )
            }
          </Box>
          <Box className={classes.divider}>
            <Divider />
          </Box>
          <Box className={classes.menuBottomBox} onClick={createButtonHandler}>
            <Typography variant="textRegular">
              {t('actions.create')}
            </Typography>
          </Box>
        </MenuList>
      </Popper>
    </div>
  );
}
