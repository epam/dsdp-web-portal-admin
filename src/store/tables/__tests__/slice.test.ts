import TablesReducer, {
  TablesState,
  getTableByNameClean,
  getTableByNameSuccess,
  getTableDataModelClean,
  getTableDataModelSuccess,
  getTableListClean,
  getTableListSuccess,
  updateTableDataModelSuccess,
} from '../slice';

describe('Tables slice', () => {
  const initialState: TablesState = {
    list: [],
    table: null,
    dataModel: '',
  };
  it('getListSuccess should set correct state', () => {
    expect(
      TablesReducer(
        initialState,
        getTableListSuccess([{ name: 'someTableName' }] as any),
      ),
    ).toEqual({
      ...initialState,
      list: [{ name: 'someTableName' }],
    });
  });
  it('getListClean should clean state', () => {
    expect(
      TablesReducer(
        {
          ...initialState,
          list: [{ name: 'someTableName' }] as any,
        },
        getTableListClean(),
      ),
    ).toEqual(initialState);
  });
  it('getByNameSuccess should set correct state', () => {
    expect(
      TablesReducer(
        initialState,
        getTableByNameSuccess({ name: 'someTableName' } as any),
      ),
    ).toEqual({
      ...initialState,
      table: { name: 'someTableName' },
    });
  });
  it('getByNameClean should clean table state', () => {
    expect(
      TablesReducer(
        {
          ...initialState,
          table: { name: 'someTableName' } as any,
        },
        getTableByNameClean(),
      ),
    ).toEqual(initialState);
  });
  it('getDataModelSuccess should set correct state', () => {
    expect(
      TablesReducer(
        initialState,
        getTableDataModelSuccess('hello'),
      ),
    ).toEqual({
      ...initialState,
      dataModel: 'hello',
    });
  });
  it('getDataModelClean should clean data model state', () => {
    expect(
      TablesReducer(
        {
          ...initialState,
          dataModel: 'hello',
        },
        getTableDataModelClean(),
      ),
    ).toEqual(initialState);
  });
  it('updateDataModelSuccess should set correct state', () => {
    expect(
      TablesReducer(
        initialState,
        updateTableDataModelSuccess('hello2'),
      ),
    ).toEqual({
      ...initialState,
      dataModel: 'hello2',
    });
  });
});
