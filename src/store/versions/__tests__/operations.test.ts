import {
  vi, describe, beforeEach, it, expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import { notify, STATUSES } from 'reapop';
import { throwError } from 'rxjs';

import * as api from 'api/versions';
import { ROUTES } from 'constants/routes';
import { MASTER_VERSION_ID } from 'constants/common';
import { getRoutePathWithVersion } from 'utils/versions';
import i18n from 'localization';
import { ERROR_TYPE } from '#shared/types/common';

import { BROWSER_PUSH_ACTION_TYPE } from 'utils/common';
import {
  mergeCandidateSuccess,
  mergeCandidateRequest,
  mergeCandidateError,
  abandonCandidateSuccess,
  abandonCandidateRequest,
  abandonCandidateError,
  getVersionsListRequest,
  getVersionsListError,
  getVersionsListSuccess,
  createVersionRequest,
  createVersionError,
  createVersionSuccess,
  getMasterRequest,
  getMasterSuccess,
  getMasterError,
  getCandidateRequest,
  getCandidateSuccess,
  getCandidateError,
  rebaseCandidateRequest,
  rebaseCandidateSuccess,
  rebaseCandidateError,
  getCandidateChangesRequest,
  revertChangeRequest, revertChangeSuccess,
} from '../slice';
import {
  mergeCandidateEpic, abandonCandidateEpic,
  getVersionsListEpic,
  createVersionEpic,
  getMasterEpic,
  getCandidateEpic,
  rebaseCandidateEpic,
  revertChangeEpic,
} from '../operations';

vi.mock('api/versions', () => {
  return {
    getVersionsList: vi.fn(),
    createVersion: vi.fn(),
    getMaster: vi.fn(),
    getCandidate: vi.fn(),
    mergeCandidate: vi.fn(),
    abandonCandidate: vi.fn(),
    rebaseCandidate: vi.fn(),
    revertChange: vi.fn(),
  };
});

vi.mock('reapop', async (importOriginal) => {
  const reapop: typeof import('reapop') = await importOriginal();
  return {
    ...reapop,
    notify: vi.fn(),
  };
});

const getVersionsListMock = vi.mocked(api.getVersionsList);
const createVersionMock = vi.mocked(api.createVersion);
const getMasterMock = vi.mocked(api.getMaster);
const getCandidateMock = vi.mocked(api.getCandidate);
const mergeCandidateMock = vi.mocked(api.mergeCandidate);
const abandonCandidateMock = vi.mocked(api.abandonCandidate);
const rebaseCandidateMock = vi.mocked(api.rebaseCandidate);
const revertChangeMock = vi.mocked(api.revertChange);
const notifyMock = vi.mocked(notify);

let testScheduler: TestScheduler;

describe('versions operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    notifyMock.mockImplementation((message, type, title) => ({
      message,
      type,
      title,
    } as any));
  });

  describe('getVersionsListEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getVersionsListMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getVersionsListRequest.type },
        }) as any;
        const output$ = getVersionsListEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getVersionsListSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getVersionsListMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getVersionsListRequest.type },
        }) as any;
        const output$ = getVersionsListEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getVersionsListError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('createVersionEpic', () => {
    it('should call success action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        createVersionMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                id: ':id',
              },
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: createVersionRequest.type,
            payload: {
              data: {
                name: 'title',
                description: 'description',
              },
            },
          },
        }) as any;

        const output$ = createVersionEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: createVersionSuccess.type,
          },
          b: {
            type: getVersionsListRequest.type,
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        createVersionMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: createVersionRequest.type,
            payload: {
              data: {
                name: 'title',
                description: 'description',
              },
            },
          },
        }) as any;

        const output$ = createVersionEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: createVersionError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('getMasterEpic', () => {
    it('should call success action', () => {
      const response = { response: {} };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getMasterMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getMasterRequest.type },
        }) as any;
        const output$ = getMasterEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getMasterSuccess.type,
            payload: {},
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getMasterMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getMasterRequest.type },
        }) as any;
        const output$ = getMasterEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getMasterError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });
  describe('getCandidateEpic', () => {
    it('should call success action', () => {
      const response = { response: {} };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getCandidateMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getCandidateRequest.type },
        }) as any;
        const output$ = getCandidateEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getCandidateSuccess.type,
            payload: {},
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getCandidateMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getCandidateRequest.type },
        }) as any;
        const output$ = getCandidateEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getCandidateError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('mergeCandidateEpic', () => {
    it('should call success action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        mergeCandidateMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {},
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: mergeCandidateRequest.type,
            payload: { versionId: 'versionId' },
          },
        }) as any;

        const output$ = mergeCandidateEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: mergeCandidateSuccess.type,
          },
          b: {
            type: BROWSER_PUSH_ACTION_TYPE,
            payload: {
              path: getRoutePathWithVersion(ROUTES.HOME, MASTER_VERSION_ID),
            },
          },
        });
      });
    });

    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        mergeCandidateMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: mergeCandidateRequest.type },
        }) as any;
        const output$ = mergeCandidateEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: mergeCandidateError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('abandonCandidateEpic', () => {
    it('should call success action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        abandonCandidateMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {},
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: abandonCandidateRequest.type,
            payload: { versionId: 'versionId' },
          },
        }) as any;

        const output$ = abandonCandidateEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: abandonCandidateSuccess.type,
          },
          b: {
            type: BROWSER_PUSH_ACTION_TYPE,
            payload: {
              path: getRoutePathWithVersion(ROUTES.HOME, MASTER_VERSION_ID),
            },
          },
        });
      });
    });

    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        abandonCandidateMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: abandonCandidateRequest.type },
        }) as any;
        const output$ = abandonCandidateEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: abandonCandidateError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('rebaseCandidateEpic', () => {
    it('should call success action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        rebaseCandidateMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {},
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: rebaseCandidateRequest.type,
            payload: { versionId: 'versionId' },
          },
        }) as any;

        const output$ = rebaseCandidateEpic(action$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: rebaseCandidateSuccess.type,
            payload: undefined,
          },
          b: {
            type: getCandidateRequest.type,
            payload: { versionId: 'versionId' },
          },
          c: {
            type: getCandidateChangesRequest.type,
            payload: { versionId: 'versionId' },
          },
        });
      });
    });

    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        rebaseCandidateMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: rebaseCandidateRequest.type },
        }) as any;
        const output$ = rebaseCandidateEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: rebaseCandidateError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('revertChangeEpic', () => {
    it('should call success action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        revertChangeMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {},
            } as any,
          }),
        );
        const action$ = hot('-a', {
          a: {
            type: revertChangeRequest.type,
            payload: { versionId: 'versionId', changeItem: { name: 'test' }, changeType: 'changedForms' },
          },
        }) as any;

        const output$ = revertChangeEpic(action$);

        expectObservable(output$).toBe('---(abcd)', {
          a: {
            message: i18n.t('components~candidateChanges.notifications.revertSuccessful', { name: 'test' }),
            type: STATUSES.success,
          },
          b: {
            type: revertChangeSuccess.type,
            payload: undefined,
          },
          c: {
            type: getCandidateRequest.type,
            payload: 'versionId',
          },
          d: {
            type: getCandidateChangesRequest.type,
            payload: 'versionId',
          },
        });
      });
    });
  });
});
