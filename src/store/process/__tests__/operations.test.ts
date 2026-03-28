import {
  vi, describe, beforeEach, it, expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/processes';
import { throwError } from 'rxjs';
import { tryAgainNotificationErrorProps } from 'constants/errorProps';
import { notify } from 'reapop';
import { ROUTES } from 'constants/routes';
import { MASTER_VERSION_ID } from 'constants/common';
import { ERROR_TYPE } from '#shared/types/common';
import i18n from 'localization';
import { BROWSER_PUSH_ACTION_TYPE } from 'utils/common';
import {
  createProcessError,
  createProcessRequest,
  createProcessSuccess,
  deleteProcessError,
  deleteProcessRequest,
  deleteProcessSuccess,
  getProcessByNameError,
  getProcessByNameRequest,
  getProcessByNameSuccess,
  getProcessListError,
  getProcessListRequest,
  getProcessListSuccess,
  setProcessETags,
  setProcessHasConflicts,
  updateProcessError,
  updateProcessRequest,
  updateProcessSuccess,
} from '../slice';
import {
  createProcessEpic,
  deleteProcessEpic,
  getProcessByNameEpic,
  getProcessListEpic,
  refreshProcessListEpic,
  updateProcessEpic,
} from '../operations';

vi.mock('api/processes', () => {
  return {
    getProcessList: vi.fn(),
    createProcess: vi.fn(),
    getProcessByName: vi.fn(),
    updateProcess: vi.fn(),
    deleteProcess: vi.fn(),
  };
});

vi.mock('reapop', () => {
  return {
    notify: vi.fn(),
  };
});

let testScheduler: TestScheduler;
const getProcessListMock = vi.mocked(api.getProcessList);
const createProcessMock = vi.mocked(api.createProcess);
const updateProcessMock = vi.mocked(api.updateProcess);
const deleteProcessMock = vi.mocked(api.deleteProcess);
const getProcessByNameMock = vi.mocked(api.getProcessByName);
const notifyMock = vi.mocked(notify);

describe('Process operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getProcessListEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getProcessListMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getProcessListRequest.type },
        }) as any;
        const output$ = getProcessListEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: getProcessListSuccess.type,
            payload: [],
          },
          b: {
            type: setProcessETags.type,
            payload: null,
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getProcessListMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getProcessListRequest.type },
        }) as any;
        const output$ = getProcessListEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getProcessListError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
  });

  describe('createProcessEpic', () => {
    const testVersionId = '42';
    const testProcessName = 'someProcess';

    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: {
            title: 'title',
          },
        } as any);
        createProcessMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
                components: [],
              },
            } as any,
          }),
        );
        const action$ = hot('-a', {
          a: {
            type: createProcessRequest.type,
            payload: {
              versionId: 'master',
              name: testProcessName,
            },
          },
        }) as any;
        const output$ = createProcessEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: createProcessSuccess.type,
            payload: undefined,
          },
          b: {
            type: setProcessHasConflicts.type,
            payload: false,
          },
        });
      });
    });
    it('should call success action with version candidate', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: {
            title: 'title',
          },
        } as any);
        createProcessMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
                components: [],
              },
            } as any,
          }),
        );
        const action$ = hot('-a', {
          a: {
            type: createProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const output$ = createProcessEpic(action$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: createProcessSuccess.type,
            payload: undefined,
          },
          b: {
            type: 'success',
            payload: { title: 'title' },
          },
          c: {
            type: BROWSER_PUSH_ACTION_TYPE,
            payload: {
              path: ROUTES.EDIT_PROCESS.replace(':versionId', testVersionId).replace(':processName', testProcessName),
            },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        createProcessMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: createProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const output$ = createProcessEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: createProcessError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
    it('should call error action with validation error', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        createProcessMock.mockImplementation(() => throwError({ status: 422 }));
        const action$ = hot('-a', {
          a: {
            type: createProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const output$ = createProcessEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: createProcessError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
              message: i18n.t('errors~form.invalidForm'),
            },
          },
        });
      });
    });
  });
  describe('updateProcessEpic', () => {
    const testVersionId = '42';
    const testProcessName = 'someProcess';

    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: {
            title: 'title',
          },
        } as any);
        updateProcessMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
                components: [],
              },
              xhr: { getResponseHeader: () => 'ETag' },
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: updateProcessRequest.type,
            payload: {
              versionId: 'master',
              name: testProcessName,
            },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { process: 'someProcess' } };
        const output$ = updateProcessEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: updateProcessSuccess.type,
            payload: undefined,
          },
          b: {
            type: setProcessETags.type,
            payload: { [testProcessName]: 'ETag' },
          },
          c: {
            type: setProcessHasConflicts.type,
            payload: false,
          },
        });
      });
    });
    it('should call success action with candidate version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: {
            title: 'title',
          },
        } as any);
        updateProcessMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
                components: [],
              },
              xhr: { getResponseHeader: () => 'ETag' },
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: updateProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { process: 'someProcess' } };
        const output$ = updateProcessEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: updateProcessSuccess.type,
            payload: undefined,
          },
          b: {
            type: setProcessETags.type,
            payload: { [testProcessName]: 'ETag' },
          },
          c: {
            type: 'success',
            payload: { title: 'title' },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateProcessMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: updateProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { process: 'someProcess' } };
        const output$ = updateProcessEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: updateProcessError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
    it('should call error action with validation error', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateProcessMock.mockImplementation(() => throwError({ status: 422 }));
        const action$ = hot('-a', {
          a: {
            type: updateProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { process: 'someProcess' } };
        const output$ = updateProcessEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: updateProcessError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
              message: i18n.t('errors~form.invalidForm'),
            },
          },
        });
      });
    });
  });

  describe('getProcessByNameEpic', () => {
    const testVersionId = '42';
    const testProcessName = 'someProcess';
    it('should call success action', () => {
      const response = { response: {}, xhr: { getResponseHeader: () => '' } };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getProcessByNameMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getProcessByNameRequest.type, payload: { name: testProcessName, versionId: testVersionId } },
        }) as any;
        const output$ = getProcessByNameEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: getProcessByNameSuccess.type,
            payload: {},
          },
          b: {
            type: setProcessETags.type,
            payload: null,
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getProcessByNameMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getProcessByNameRequest.type, payload: { id: 1 } },
        }) as any;
        const output$ = getProcessByNameEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getProcessByNameError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
  });

  describe('deleteProcessEpic', () => {
    const testVersionId = '42';
    const testProcessName = 'someProcess';

    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        deleteProcessMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
              },
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: deleteProcessRequest.type,
            payload: {
              versionId: 'master',
              name: testProcessName,
            },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { process: 'someProcess' } };
        const output$ = deleteProcessEpic(action$, state$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: deleteProcessSuccess.type,
            payload: 'master',
          },
          b: {
            type: setProcessHasConflicts.type,
            payload: false,
          },
        });
      });
    });
    it('should call success action with candidate version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: {
            title: 'title',
          },
        } as any);
        deleteProcessMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
              },
            },
          } as any),
        );
        const action$ = hot('-a', {
          a: {
            type: deleteProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { process: 'someProcess' } };
        const output$ = deleteProcessEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: deleteProcessSuccess.type,
            payload: testVersionId,
          },
          b: {
            type: 'success',
            payload: { title: 'title' },
          },
          c: {
            type: BROWSER_PUSH_ACTION_TYPE,
            payload: {
              path: ROUTES.HOME.replace(':versionId', testVersionId),
            },
          },
        });
      });
    });

    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        deleteProcessMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: deleteProcessRequest.type,
            payload: {
              versionId: testVersionId,
              name: testProcessName,
            },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { process: 'someProcess' } };
        const output$ = deleteProcessEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: deleteProcessError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
  });
  describe('refreshProcessListEpic', () => {
    it('should refresh existing process list on successful delete when removing from master', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('-a', {
          a: {
            type: deleteProcessSuccess.type,
            payload: MASTER_VERSION_ID,
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { process: { list: [{}] } };
        const output$ = refreshProcessListEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getProcessListRequest.type,
            payload: MASTER_VERSION_ID,
          },
        });
      });
    });
  });
});
