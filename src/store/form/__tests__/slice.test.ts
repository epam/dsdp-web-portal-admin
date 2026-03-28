import { Form, FormListItem } from 'types/form';
import FormReducer, {
  FormState,
  getFormByNameClean, getFormByNameSuccess, getFormListClean, getFormListSuccess, setFormETags, setHasConflicts,
} from '../slice';

describe('Process slice', () => {
  const initialState: FormState = {
    list: [],
    form: null,
    hasConflicts: null,
    eTags: null,
  };

  it('getFormListSuccess', () => {
    expect(FormReducer(initialState, getFormListSuccess([{ name: 'name' }] as FormListItem[])))
      .toMatchObject({ ...initialState, list: [{ name: 'name' }] });
  });

  it('getFormListClean', () => {
    expect(FormReducer(initialState, getFormListClean()))
      .toMatchObject({ ...initialState, list: [] });
  });

  it('getFormByNameSuccess', () => {
    expect(FormReducer(initialState, getFormByNameSuccess({ name: 'name' } as Form)))
      .toMatchObject({ ...initialState, form: { name: 'name' } });
  });

  it('getFormByNameClean', () => {
    expect(FormReducer(initialState, getFormByNameClean()))
      .toMatchObject({ ...initialState, form: null });
  });

  it('setHasConflicts', () => {
    expect(FormReducer(initialState, setHasConflicts(true)))
      .toMatchObject({ ...initialState, hasConflicts: true });
  });

  it('setFormETags', () => {
    expect(FormReducer(initialState, setFormETags({ eTag: 'tag' })))
      .toMatchObject({ ...initialState, eTags: { eTag: 'tag' } });
  });
});
