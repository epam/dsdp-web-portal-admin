import { CurrentUser } from '#shared/types/user';
import CurrentUserReducer, {
  CurrentUserState, getInfoError, getInfoRequest, getInfoSuccess,
} from '../slice';

describe('CurrentUser slice', () => {
  const initialState: CurrentUserState = {
    info: null,
    initialized: false,
    authenticated: false,
  };

  it('getInfoRequest action should set info to null', () => {
    expect(CurrentUserReducer(initialState, getInfoRequest()))
      .toMatchObject({ ...initialState, info: null });
  });

  it('getInfoError action should set initialized to true', () => {
    expect(CurrentUserReducer(initialState, getInfoError({}))).toMatchObject({ ...initialState, initialized: true });
  });

  it('getInfoSuccess action should set initialized and authenticated to true and set info to given value', () => {
    expect(CurrentUserReducer(initialState, getInfoSuccess({ name: 'someName' } as CurrentUser)))
      .toMatchObject({
        ...initialState, info: { name: 'someName' }, initialized: true, authenticated: true,
      });
  });
});
