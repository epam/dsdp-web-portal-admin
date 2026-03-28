import {
  vi, describe, it, expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/users';
import { throwError } from 'rxjs';
import { ERROR_TYPE } from '#shared/types/common';
import { ROUTES } from 'constants/routes';
import { getRoutePathWithVersion } from 'utils/versions';
import { BROWSER_PUSH_ACTION_TYPE } from 'utils/common';
import {
  getImportInfoEpic,
  sendImportFileEpic,
  startImportEpic,
  deleteImportFileEpic,
} from '../operations';
import {
  getImportInfoRequest,
  getImportInfoError,
  getImportInfoSuccess,

  sendImportFileRequest,
  sendImportFileError,
  sendImportFileSuccess,

  startImportRequest,
  startImportError,
  startImportSuccess,

  deleteImportFileRequest,
  deleteImportFileError,
  deleteImportFileSuccess,
} from '../slice';

vi.mock('api/users', () => {
  return {
    getImportInfo: vi.fn(),
    sendImportFile: vi.fn(),
    startImport: vi.fn(),
    deleteImportFile: vi.fn(),
  };
});

const getImportInfoMock = vi.mocked(api.getImportInfo);
const sendImportFileMock = vi.mocked(api.sendImportFile);
const startImportMock = vi.mocked(api.startImport);
const deleteImportFileMock = vi.mocked(api.deleteImportFile);

let testScheduler: TestScheduler;

describe('users operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getImportInfoEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getImportInfoMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getImportInfoRequest.type },
        }) as any;
        const output$ = getImportInfoEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getImportInfoSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getImportInfoMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getImportInfoRequest.type },
        }) as any;
        const output$ = getImportInfoEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getImportInfoError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('sendImportFileEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        sendImportFileMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: sendImportFileRequest.type },
        }) as any;
        const output$ = sendImportFileEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: sendImportFileSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        sendImportFileMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: sendImportFileRequest.type },
        }) as any;
        const output$ = sendImportFileEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: sendImportFileError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('startImportEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        startImportMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: startImportRequest.type, payload: { versionId: 1 } },
        }) as any;
        const output$ = startImportEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: startImportSuccess.type,
          },
          b: {
            type: BROWSER_PUSH_ACTION_TYPE,
            payload: {
              path: getRoutePathWithVersion(ROUTES.IMPORT_USERS_SUCCESS, '1'),
            },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        startImportMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: startImportRequest.type, payload: {} },
        }) as any;
        const output$ = startImportEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: startImportError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('deleteImportFileEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        deleteImportFileMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: deleteImportFileRequest.type },
        }) as any;
        const output$ = deleteImportFileEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: deleteImportFileSuccess.type,
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        deleteImportFileMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: deleteImportFileRequest.type },
        }) as any;
        const output$ = deleteImportFileEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: deleteImportFileError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });
});
