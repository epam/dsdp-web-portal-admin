import ReportReducer, { ReportState, getReportListClean, getReportListSuccess } from '../slice';

describe('Report slice', () => {
  const initialState: ReportState = {
    list: [],
  };
  it('getReportListSuccess should set correct state', () => {
    expect(
      ReportReducer(
        initialState,
        getReportListSuccess([{ id: 'someId' }] as any),
      ),
    ).toEqual({
      ...initialState,
      list: [{ id: 'someId' }],
    });
  });
  it('getReportListClean should clean state', () => {
    expect(
      ReportReducer(
        {
          ...initialState,
          list: [{ id: 'someId' }] as any,
        },
        getReportListClean(),
      ),
    ).toEqual(initialState);
  });
});
