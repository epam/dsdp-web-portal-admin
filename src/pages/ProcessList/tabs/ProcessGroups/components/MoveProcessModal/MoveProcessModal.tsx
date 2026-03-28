import React, {
  useEffect, useCallback, useState, useRef, useMemo,
} from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';

import Modal from '#web-components/components/Modal';
import Button, { ButtonVariants } from '#web-components/components/Button';
import Input from '#web-components/components/FormControls/Input';
import MenuList from '#web-components/components/MenuList';
import MenuItem from '#web-components/components/MenuList/components/MenuItem';
import Popper from '#web-components/components/Popper';
import Divider from '#web-components/components/Divider';
import Typography from '#web-components/components/Typography';
import ArrowDropDownIcon from '#web-components/components/Icons/ArrowDropDownIcon';
import { ProcessDefinition } from '#shared/types/processDefinition';

import { REGEX_VALID_NAME } from '../EditGroupNameModal/EditGroupNameModal';
import styles from './MoveProcessModal.styles';

const useStyles = makeStyles(styles, { name: 'MoveProcessModal' });

interface Props {
  existingGroupNames: Array<string>;
  isOpen: boolean;
  process: ProcessDefinition,
  groupFieldValue?: string;
  moveToUngroupedEnable?: boolean;
  onOpenChange: (open: boolean) => void;
  onMoveToGroup: (process: ProcessDefinition, groupName?: string, currentGroup?: string) => void;
  onMoveToNewGroup: (process: ProcessDefinition, groupName: string, currentGroup?: string) => void;
  onMoveToUngrouped: (process: ProcessDefinition, currentGroup?: string) => void;
  text: {
    title: string;
    description: string;
    selectLabel: string;
    groupFieldLabel: string;
    moveButtonLabel: string;
    placeholder: string;
    existingGroupNamesLabel: string;
    moveToNewGroup: string;
    excludeFromGroup: string;
  }
}

export default function MoveProcessModal(props: Props) {
  const {
    text,
    isOpen,
    process,
    groupFieldValue,
    moveToUngroupedEnable,
    existingGroupNames,
    onOpenChange,
    onMoveToGroup,
    onMoveToNewGroup,
    onMoveToUngrouped,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [newGroup, setNewGroup] = useState<boolean>(false);
  const [outOfGroup, setOutOfGroup] = useState<boolean>(false);
  const [group, setGroup] = useState<string | null>(null);
  const anchorEl = useRef<HTMLButtonElement | null>(null);
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'processList' });
  const {
    title,
    description,
    selectLabel,
    moveButtonLabel,
    placeholder,
    existingGroupNamesLabel,
    excludeFromGroup,
    moveToNewGroup,
    groupFieldLabel,
  } = text;
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    shouldUnregister: true,
    mode: 'onChange',
    defaultValues: {
      groupName: '',
    },
  });
  const handleClick = () => {
    setOpen((prevStateOfOpen) => !prevStateOfOpen);
  };
  const handleSelect = useCallback((name) => {
    handleClick();
    setGroup(name);
    setNewGroup(false);
    setOutOfGroup(false);
  }, [setGroup]);
  const handleSelectNewGroup = useCallback(() => {
    handleClick();
    setNewGroup(true);
  }, []);
  const handleSelectOutOfGroup = useCallback(() => {
    handleClick();
    setOutOfGroup(true);
  }, []);
  const submitCallback = useCallback(({ groupName }) => {
    if (outOfGroup) {
      onMoveToUngrouped(process, groupFieldValue);
    }
    if (newGroup) {
      onMoveToNewGroup(process, groupName, groupFieldValue);
    }
    if (!group) {
      return;
    }
    onMoveToGroup(process, group, groupFieldValue);
  }, [group, groupFieldValue, newGroup, onMoveToUngrouped, onMoveToGroup, onMoveToNewGroup, outOfGroup, process]);

  useEffect(() => {
    setGroup(null);
    setNewGroup(false);
  }, [isOpen]);

  const selected = useMemo(() => {
    if (outOfGroup) {
      return excludeFromGroup;
    }
    if (newGroup) {
      return moveToNewGroup;
    }
    return group;
  }, [excludeFromGroup, group, moveToNewGroup, newGroup, outOfGroup]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      hasCloseBtn
    >
      <Box mb={8} mt={6}>
        <Typography variant="textRegular">{description}</Typography>
        <Typography variant="textTiny" className={classes.selectLabel}>{selectLabel}</Typography>
        <Button
          size="medium"
          variant={ButtonVariants.text}
          className={classes.selectButton}
          onClick={handleClick}
          buttonRef={anchorEl}
        >
          <Box className={classes.selectButtonText}>
            {selected ? (
              <Typography variant="textRegular">
                {selected}
              </Typography>
            ) : (
              <Typography variant="textRegular" className={classes.placeholder}>
                {placeholder}
              </Typography>
            )}
          </Box>
          <ArrowDropDownIcon className={clsx(open ? classes.arrowUp : undefined, classes.arrowIcon)} />
        </Button>
        <Popper
          open={open}
          onClose={handleClick}
          anchorEl={anchorEl}
          placement="bottom-start"
          fullWidth
          disablePortal
        >
          <MenuList className={classes.paper}>
            {existingGroupNames.length ? (
              <Box className={classes.menuSimpleBox}>
                <Typography variant="textTiny" className={classes.secondaryText}>
                  {existingGroupNamesLabel}
                </Typography>
              </Box>
            ) : null}
            {
              existingGroupNames.length
                ? (
                  <>
                    {existingGroupNames.map((name) => (
                      <MenuItem
                        key={name}
                        onClick={() => handleSelect(name)}
                        className={classes.group}
                        disabled={group === name || groupFieldValue === name}
                      >
                        <Typography>
                          {name}
                        </Typography>
                      </MenuItem>
                    ))}
                    <Box className={classes.divider}>
                      <Divider />
                    </Box>
                  </>
                )
                : null
              }
            <MenuItem
              onClick={handleSelectNewGroup}
              className={classes.group}
              disabled={newGroup}
            >
              <Typography>{moveToNewGroup}</Typography>
            </MenuItem>
            <MenuItem
              onClick={handleSelectOutOfGroup}
              className={clsx(classes.group)}
              disabled={!moveToUngroupedEnable || outOfGroup}
            >
              <Typography>{excludeFromGroup}</Typography>
            </MenuItem>
          </MenuList>
        </Popper>
        {newGroup && (
          <Box mt={4}>
            <Controller
              name="groupName"
              control={control}
              rules={{
                required: i18n.t('errors~form.fieldIsRequired') as string,
                minLength: {
                  value: 3,
                  message: i18n.t('errors~form.invalidField') as string,
                },
                maxLength: {
                  value: 512,
                  message: i18n.t('errors~form.invalidField') as string,
                },
                pattern: {
                  value: REGEX_VALID_NAME,
                  message: i18n.t('errors~form.invalidField') as string,
                },
                validate: (value) => (existingGroupNames.includes(value)
                  ? t('modals.groupName.existsError') as string
                  : true),
              }}
              render={({ field }) => (
                <Input
                  isLabelShrink
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.groupName}
                  label={groupFieldLabel}
                  placeholder={t('modals.groupName.placeholder')}
                  description={t('modals.groupName.description')}
                />
              )}
            />
          </Box>
        )}
      </Box>
      { /* TODO: change after completing MDTUDDM-22230 */ }
      <Box className={classes.buttonBox}>
        <Button
          size="large"
          onClick={handleSubmit(submitCallback)}
          disabled={!selected || (newGroup && !isValid)}
        >
          {moveButtonLabel}
        </Button>
        <Button
          size="large"
          onClick={() => onOpenChange(false)}
          variant={ButtonVariants.secondary}
        >
          {t('modals.groupName.cancelButton')}
        </Button>
      </Box>
    </Modal>
  );
}
