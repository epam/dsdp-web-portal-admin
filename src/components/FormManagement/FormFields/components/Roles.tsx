import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useFormContext, Controller, useWatch } from 'react-hook-form';
import Input from '#web-components/components/FormControls/Input';
import InlineButton from '#web-components/components/InlineButton';
import Chip from '#web-components/components/Chip';
import { X_PATH } from 'constants/xPath';
import styles from './Roles.styles';

const useStyles = makeStyles(styles, { name: 'Roles' });
interface RolesProps {
  isReadOnly?: boolean;
}

export default function Roles({ isReadOnly }: RolesProps) {
  const classes = useStyles();
  const {
    control, formState: { errors }, setValue, register, setError, clearErrors,
  } = useFormContext();
  const { t } = useTranslation('domains');
  register('roleName', { value: '' });
  const roleName = useWatch({ control, name: 'roleName' });
  const roles = useWatch({ control, name: 'roles' });

  const addRole = useCallback(() => {
    if (!errors.roleName) {
      if (!roleName) {
        setError('roleName', { type: 'required', message: t('errors~form.fieldIsRequired') });
        return;
      }
      const isRoleAlreadyExists = roles.includes(roleName);
      if (isRoleAlreadyExists) {
        setError('roleName', { type: 'required', message: t('errors~form.roleAlreadyExists') });
        return;
      }
      setValue('roles', [roleName, ...roles]);
      setValue('roleName', '');
    }
  }, [errors.roleName, roleName, roles, setError, setValue, t]);

  const deleteRole = useCallback((role: string) => {
    setValue('roles', roles.filter(((r: string) => r !== role)));
    clearErrors('roleName');
  }, [clearErrors, roles, setValue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addRole();
    }
  }, [addRole]);

  return (
    <>
      {!!roles.length && (
        <div className={classes.roles}>
          <span className={classes.roleLabel}>{t('form.fields.roles')}</span>
          {roles.map((role: string) => (
            <div key={role} className={classes.chip}>
              <Chip label={role} onDelete={() => deleteRole(role)} disabled={isReadOnly} />
            </div>
          ))}
        </div>
      )}

      <div className={classes.box}>
        <Controller
          name="roleName"
          control={control}
          rules={{
            pattern: {
              value: /^[a-zA-Z0-9-_]+$/,
              message: t('errors~form.invalidField') as string,
            },
          }}
          render={({ field }) => (
            <Input
              fullWidth
              required
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onKeyDown={handleKeyDown}
              isLabelShrink={!!field.value}
              error={errors[field.name]}
              placeholder={t('form.fields.enterRoleName')}
              disabled={isReadOnly}
              className={classes.input}
            />
          )}
        />
        <InlineButton
          leftIcon={<AddIcon />}
          onLinkClick={addRole}
          classes={{ link: classes.btn }}
          disabled={isReadOnly}
          data-xpath={X_PATH.addRoleBtn}
        >
          {t('form.fields.addRole')}
        </InlineButton>
      </div>
    </>
  );
}
