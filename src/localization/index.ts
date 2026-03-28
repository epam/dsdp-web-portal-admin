import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getAppLanguage, loadLanguage } from '#shared/utils/common';
import { COOKIE_LANGUAGE } from '#shared/constants/common';
import Cookies from 'js-cookie';
import { APP_URL_PREFIX } from 'constants/routes';
import { localesApi } from 'api';

const supportedLanguages = ENVIRONMENT_VARIABLES.supportedLanguages || [];
const localeUrlPrefix = APP_URL_PREFIX.startsWith('/') ? APP_URL_PREFIX.slice(1) : APP_URL_PREFIX;

if (supportedLanguages.length) {
  supportedLanguages.forEach((lng) => {
    loadLanguage(lng, localeUrlPrefix, i18n, localesApi);
  });
} else {
  loadLanguage(ENVIRONMENT_VARIABLES?.language, localeUrlPrefix, i18n, localesApi);
}

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: 'languageDetector',
  lookup() {
    const appLanguage = getAppLanguage(ENVIRONMENT_VARIABLES.language, ENVIRONMENT_VARIABLES.supportedLanguages);
    return appLanguage;
  },
});

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    nsSeparator: '~',
    keySeparator: '.',
    interpolation: {
      escapeValue: false,
    },
    fallbackNS: 'form',
    react: {
      useSuspense: false,
      bindI18nStore: 'added',
    },
    detection: {
      order: ['languageDetector'],
      lookupCookie: COOKIE_LANGUAGE,
    },
  });

i18n.on('languageChanged', (lng) => {
  Cookies.set(COOKIE_LANGUAGE, lng, { expires: 365 });
  document.documentElement.setAttribute('lang', lng);
});

export default i18n;
