import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import useVersion from 'hooks/useVersion';
import { isMaster } from 'utils/versions';
import { X_PATH } from 'constants/xPath';
import {
  getSettingsRequest,
  updateSettingsRequest,
  selectSettingsIsLoading,
  selectUpdateSettingsIsLoading,
  selectSettings,
} from 'store/settings';
import { emailBlacklistValidator } from 'utils/formControls';
import CommonLayout from 'components/Layouts/CommonLayout';
import { EMAIL_PATTERN } from '#shared/constants/formControls';
import Input from '#web-components/components/FormControls/Input';
import Typography from '#web-components/components/Typography';
import Button, { ButtonVariants } from '#web-components/components/Button';

import styles from './MailSettings.styles';

const useStyles = makeStyles(styles, { name: 'GlobalSettings' });

export default function MailSettingsPage() {
  const classes = useStyles();
  const isLoading = useSelector(selectSettingsIsLoading);
  const isUpdating = useSelector(selectUpdateSettingsIsLoading);
  const settingsData = useSelector(selectSettings);
  const { versionId } = useVersion();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('pages', { keyPrefix: 'globalSettings' });
  const themeItems = [
    { value: 'OSDefaultLight', label: t('text.OS_Default_Light') },
    { value: 'DiiaLight', label: t('text.Diia_Light') },
  ].filter((item) => (ENVIRONMENT_VARIABLES.region !== 'global' || item.value !== 'DiiaLight'));
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm({
    shouldUnregister: true,
    defaultValues: {
      supportEmail: '',
      titleFull: '',
      title: '',
      theme: themeItems[0].value,
      blacklistedDomains: [] as (string[] | null),
    },
  });
  const isReadOnly = isMaster(versionId);

  const onSubmit = useCallback((data) => {
    const {
      titleFull, title, blacklistedDomains, ...inputs
    } = data;
    const settings = {
      ...inputs,
      titleFull: titleFull.trim(),
      title: title.trim(),
      blacklistedDomains: blacklistedDomains || [],
    };
    dispatch(updateSettingsRequest({ versionId, settings }));
  }, [dispatch, versionId]);

  useEffect(() => {
    dispatch(getSettingsRequest(versionId));
  }, [dispatch, versionId]);

  useEffect(() => {
    if (settingsData) {
      const {
        supportEmail,
        titleFull,
        title,
        theme,
        blacklistedDomains,
      } = settingsData;
      setValue('supportEmail', supportEmail);
      setValue('titleFull', titleFull);
      setValue('title', title);
      setValue('theme', theme);
      setValue('blacklistedDomains', blacklistedDomains || []);
    }
  }, [setValue, settingsData]);

  return (
    <CommonLayout title={t('title')} hint={isReadOnly ? t('text.hint') : undefined} isLoading={isLoading || isUpdating}>
      <form className={classes.form}>
        <Typography variant="h4" className={classes.title}>
          {t('text.support')}
        </Typography>
        <Typography variant="textRegular" className={classes.description}>
          {t('text.supportDescription')}
        </Typography>
        <Controller
          name="supportEmail"
          control={control}
          rules={{
            required: i18n.t('errors~form.fieldIsRequired') as string,
            pattern: { value: EMAIL_PATTERN, message: i18n.t('errors~form.emailPattern') },
            validate: (email) => {
              if (emailBlacklistValidator(email)) {
                return i18n.t('errors~form.emailBlackListError') as string;
              }

              return undefined;
            },
          }}
          render={({ field }) => (
            <Input
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              isLabelShrink={!!field.value}
              error={errors[field.name]}
              className={classes.textField}
              label={t('fields.supportAddress')}
              placeholder="name@email.com"
              disabled={isReadOnly}
              required
            />
          )}
        />

        {!isReadOnly && (
          <Button
            size="large"
            variant={ButtonVariants.primary}
            className={classes.btnSubmit}
            onClick={handleSubmit(onSubmit)}
            data-xpath={X_PATH.settingSubmit}
          >
            {t('actions.submitButton')}
          </Button>
        )}

      </form>
    </CommonLayout>
  );
}
