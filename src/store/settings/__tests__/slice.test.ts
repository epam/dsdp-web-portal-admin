import { Settings } from 'types/settings';
import SettingsReducer, {
  SettingsState,
  getSettingsRequest,
  getSettingsError,
  getSettingsSuccess,
  updateSettingsRequest,
  updateSettingsError,
  updateSettingsSuccess,
  getMasterSupportEmailRequest,
  getMasterSupportEmailError,
  getMasterSupportEmailSuccess,
} from '../slice';

describe('Settings slice', () => {
  const initialState: SettingsState = {
    masterSupportEmail: null,
    settings: null,
  };

  it('getSettingsRequest action should set settings', () => {
    expect(SettingsReducer(initialState, getSettingsRequest('versionId')))
      .toMatchObject({ ...initialState, settings: null });
  });

  it('getSettingsError action should not set settings', () => {
    expect(SettingsReducer(initialState, getSettingsError({}))).toMatchObject(initialState);
  });

  it('getSettingsSuccess action should set settings', () => {
    const response = {
      title: 'title',
      titleFull: 'titleFull',
      theme: 'theme',
      supportEmail: 'supportEmail',
      blacklistedDomains: null,
    };
    expect(SettingsReducer(initialState, getSettingsSuccess(response as Settings)))
      .toMatchObject({
        ...initialState, settings: response,
      });
  });

  it('updateSettingsRequest action should not set settings', () => {
    const settings = {
      title: 'title',
      titleFull: 'titleFull',
      theme: 'theme',
      supportEmail: 'supportEmail',
      blacklistedDomains: null,
    };
    expect(SettingsReducer(initialState, updateSettingsRequest({ versionId: 'versionId', settings })))
      .toMatchObject({ ...initialState, settings: null });
  });

  it('updateSettingsError action should not set settings', () => {
    expect(SettingsReducer(initialState, updateSettingsError({}))).toMatchObject(initialState);
  });

  it('updateSettingsSuccess action should set settings', () => {
    const response = {
      title: 'title',
      titleFull: 'titleFull',
      theme: 'theme',
      supportEmail: 'supportEmail',
      blacklistedDomains: null,
    };
    expect(SettingsReducer(initialState, updateSettingsSuccess(response as Settings)))
      .toMatchObject({
        ...initialState, settings: response,
      });
  });

  it('getMasterSupportEmailRequest action should set settings', () => {
    expect(SettingsReducer(initialState, getMasterSupportEmailRequest()))
      .toMatchObject({ ...initialState, settings: null });
  });

  it('getMasterSupportEmailError action should not set settings', () => {
    expect(SettingsReducer(initialState, getMasterSupportEmailError({}))).toMatchObject(initialState);
  });

  it('getMasterSupportEmailSuccess action should set settings', () => {
    const response = {
      title: 'title',
      titleFull: 'titleFull',
      theme: 'theme',
      supportEmail: 'supportEmail',
      blacklistedDomains: null,
    };
    expect(SettingsReducer(initialState, getMasterSupportEmailSuccess(response as Settings)))
      .toMatchObject({
        ...initialState, masterSupportEmail: response.supportEmail,
      });
  });
});
