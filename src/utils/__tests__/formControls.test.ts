import { emailBlacklistValidator } from '../formControls';

describe('formControlsUtils', () => {
  describe('emailBlacklistValidator', () => {
    it('should not allow blacklisted emails', () => {
      global.ENVIRONMENT_VARIABLES = {
        apiUrl: '',
        kibanaUrl: '',
        userLoadLogFilter: '',
        emailBlacklist: ['mail.com'],
        languageServerUrl: '',
        digitalDocumentsMaxFileSize: '100MB',
        digitalDocumentsMaxTotalFileSize: '100MB',
        language: 'uk',
        supportedLanguages: ['uk', 'en'],
        region: 'ua',
        cicdUrl: '',
      };
      expect(emailBlacklistValidator('test@mail.com')).toBe(true);
    });

    it('should allow not blacklisted emails', () => {
      global.ENVIRONMENT_VARIABLES = {
        apiUrl: '',
        kibanaUrl: '',
        userLoadLogFilter: '',
        emailBlacklist: ['mail.com'],
        languageServerUrl: '',
        digitalDocumentsMaxFileSize: '100MB',
        digitalDocumentsMaxTotalFileSize: '100MB',
        language: 'uk',
        supportedLanguages: ['uk', 'en'],
        region: 'ua',
        cicdUrl: '',
      };
      expect(emailBlacklistValidator('test@mail.ru')).toBe(false);
    });
  });
});
