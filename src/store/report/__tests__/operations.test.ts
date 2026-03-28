import {
  vi,
  describe,
  beforeEach,
  it,
  expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/reports';
import { throwError } from 'rxjs';
import {
  getReportListEpic,
} from '../operations';
import { getReportListError, getReportListRequest, getReportListSuccess } from '../slice';

vi.mock('api/reports', () => {
  return {
    getReportList: vi.fn(),
  };
});

let testScheduler: TestScheduler;
const getReportListMock = vi.mocked(api.getReportList);

describe('Reports operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getReportListEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getReportListMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: { type: getReportListRequest.type },
        }) as any;
        const output$ = getReportListEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getReportListSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getReportListMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getReportListRequest.type },
        }) as any;
        const output$ = getReportListEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getReportListError.type,
            payload: {
              message: 'some api error',
            },
          },
        });
      });
    });
  });
});
