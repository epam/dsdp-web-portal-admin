import { I18nListItem } from 'types/i18n';
import I18nReducer, {
  I18nState,
  getI18nListClean,
  getI18nListSuccess,
  getI18nByNameSuccess,
  getI18nByNameClean,
  setI18nETags,
  setHasConflicts,
} from '../slice';

describe('I18n slice', () => {
  const initialState: I18nState = {
    list: [],
    i18nContent: null,
    hasConflicts: null,
    eTags: null,
  };

  it('getI18nListSuccess', () => {
    expect(I18nReducer(initialState, getI18nListSuccess([{ name: 'name' }] as I18nListItem[])))
      .toMatchObject({ ...initialState, list: [{ name: 'name' }] });
  });

  it('getI18nListClean', () => {
    const state = {
      ...initialState,
      list: [{ name: 'name' }],
    };
    expect(I18nReducer(state, getI18nListClean()))
      .toMatchObject({ ...initialState, list: [] });
  });

  it('getI18nByNameSuccess', () => {
    expect(I18nReducer(initialState, getI18nByNameSuccess('new payload')))
      .toMatchObject({ ...initialState, i18nContent: 'new payload' });
  });

  it('getI18nByNameClean', () => {
    const state = {
      ...initialState,
      i18nContent: 'some content',
    };
    expect(I18nReducer(state, getI18nByNameClean()))
      .toMatchObject({ ...initialState, i18nContent: null });
  });

  it('setHasConflicts', () => {
    expect(I18nReducer(initialState, setHasConflicts(true)))
      .toMatchObject({ ...initialState, hasConflicts: true });
  });

  it('setI18nETags', () => {
    expect(I18nReducer(initialState, setI18nETags({ en: 'tag' })))
      .toMatchObject({ ...initialState, eTags: { en: 'tag' } });
  });
});
