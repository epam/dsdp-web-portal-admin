import i18n from 'localization';

export const isRequiredRules = () => ({
  required: i18n.t('errors~form.fieldIsRequired') as string,
});

export const formPathRules = () => ({
  required: i18n.t('errors~form.fieldIsRequired') as string,
  pattern: {
    value: /^(?!\/|-)[a-zA-Z0-9-]+(?<!\/|-)$/,
    message: i18n.t('errors~form.invalidCharacters') as string,
  },
});

export const bpTitleRules = () => ({
  required: i18n.t('errors~form.fieldIsRequired') as string,
  minLength: {
    value: 3,
    message: i18n.t('errors~form.invalidField'),
  },
  maxLength: {
    value: 100,
    message: i18n.t('errors~form.invalidField'),
  },
  pattern: {
    value: /^[A-Za-zА-ЯІЄЇҐа-яієїґʼ\s0-9-_'’`.,]+$/g,
    message: i18n.t('errors~form.invalidField'),
  },
});

export const bpNamePattern = /^[a-zA-Z_][a-zA-Z0-9-_]*[a-zA-Z_]$/;

export const bpNameRules = () => ({
  required: i18n.t('errors~form.fieldIsRequired') as string,
  minLength: {
    value: 3,
    message: i18n.t('errors~form.invalidField'),
  },
  maxLength: {
    value: 50,
    message: i18n.t('errors~form.invalidField'),
  },
  pattern: {
    value: bpNamePattern,
    message: i18n.t('errors~form.invalidField') as string,
  },
});
