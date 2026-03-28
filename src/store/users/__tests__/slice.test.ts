import UsersReducer, { UsersState, getImportInfoSuccess, sendImportFileClean } from '../slice';

describe('Users slice', () => {
  const initialState: UsersState = {
    fileInfo: null,
  };
  it('getImportInfoSuccess should set correct state', () => {
    expect(
      UsersReducer(
        initialState,
        getImportInfoSuccess({ id: 'someId' } as any),
      ),
    ).toEqual({
      fileInfo: { id: 'someId' },
    });
  });
  it('sendImportFileSuccess should set correct state', () => {
    expect(
      UsersReducer(
        initialState,
        getImportInfoSuccess({ id: 'someId' } as any),
      ),
    ).toEqual({
      fileInfo: { id: 'someId' },
    });
  });
  it('sendImportFileClean should clean state', () => {
    expect(
      UsersReducer(
        {
          ...initialState,
          fileInfo: { id: 'someId' } as any,
        },
        sendImportFileClean(),
      ),
    ).toEqual(initialState);
  });
  it('deleteImportFileSuccess should delete fileInfo', () => {
    expect(
      UsersReducer(
        {
          ...initialState,
          fileInfo: { id: 'someId' } as any,
        },
        sendImportFileClean(),
      ),
    ).toEqual({ ...initialState, fileInfo: null });
  });
});
