import {
  vi, describe, it, expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import { API_APPENDIX } from 'constants/baseUrl';
import { ROUTES } from 'constants/routes';
import * as api from 'api/user';
import { MASTER_VERSION_ID, VERSION_ID } from 'constants/common';
import { of, throwError } from 'rxjs';
import { getUserInfoEpic, userLoginEpic } from '../operations';
import {
  getInfoError, getInfoRequest, getInfoSuccess, loginRequest,
} from '../slice';

vi.mock('api/user', () => {
  return {
    getInfo: vi.fn(),
  };
});

// const getPendingTasksCountMock = vi.mocked(api.getPendingTasksCount);
const getInfoApiMock = vi.mocked(api.getInfo);
let testScheduler: TestScheduler;

describe('currentUser operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('userLoginEpic', () => {
    it('should call replace window.location', () => {
      expect.assertions(1);
      Object.defineProperty(window, 'location', {
        value: {
          replace: vi.fn(),
          origin: 'someOrigin',
        },
      });
      const action$ = of(loginRequest({})) as any;
      return userLoginEpic(action$).toPromise().then(() => {
        expect(window.location.replace)
          .toHaveBeenLastCalledWith(`someOrigin/${API_APPENDIX}${ROUTES.HOME.replace(VERSION_ID, MASTER_VERSION_ID)}`);
      });
    });
  });
  describe('getUserInfoEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getInfoApiMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: { type: getInfoRequest.type },
        }) as any;
        const output$ = getUserInfoEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getInfoSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getInfoApiMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getInfoRequest.type },
        }) as any;
        const output$ = getUserInfoEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getInfoError.type,
            payload: {},
          },
        });
      });
    });
  });
});
