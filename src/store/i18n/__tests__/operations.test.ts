import {
  vi, describe, it, expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/i18n';
import i18next from 'i18next';
import { throwError } from 'rxjs';
import { notify } from 'reapop';
import { ROUTES } from 'constants/routes';
import { MASTER_VERSION_ID } from 'constants/common';
import { BROWSER_PUSH_ACTION_TYPE } from 'utils/common';
import {
  getI18nListEpic,
  createI18nEpic,
  updateI18nEpic,
  deleteI18nEpic,
  refreshI18nListEpic, getI18nByNameEpic,
} from '../operations';
import {
  createI18nRequest,
  createI18nSuccess,
  createI18nError,
  getI18nListRequest,
  getI18nListError,
  getI18nListSuccess,
  getI18nByNameSuccess,
  getI18nByNameError,
  deleteI18nRequest,
  deleteI18nError,
  deleteI18nSuccess,
  updateI18nRequest,
  updateI18nError,
  updateI18nSuccess,
  setHasConflicts,
  setI18nETags,
  getI18nByNameRequest,
} from '../slice';

vi.mock('api/i18n', () => {
  return {
    getI18nList: vi.fn(),
    getI18nByName: vi.fn(),
    createI18n: vi.fn(),
    updateI18n: vi.fn(),
    deleteI18n: vi.fn(),
  };
});

vi.mock('reapop', () => {
  return {
    notify: vi.fn(),
  };
});

const getI18nListMock = vi.mocked(api.getI18nList);
const getI18nByNameMock = vi.mocked(api.getI18nByName);
const createI18nMock = vi.mocked(api.createI18n);
const updateI18nMock = vi.mocked(api.updateI18n);
const deleteI18nMock = vi.mocked(api.deleteI18n);
const notifyMock = vi.mocked(notify);
let testScheduler: TestScheduler;

describe('i18n operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getI18nListEpic', () => {
    it('should call success action', () => {
      const response = { response: [{ name: 'i18nName', eTag: 'ETag' }] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getI18nListMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: { type: getI18nListRequest.type },
        }) as any;
        const output$ = getI18nListEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: getI18nListSuccess.type,
            payload: [{ name: 'i18nName', eTag: 'ETag' }],
          },
          b: {
            type: setI18nETags.type,
            payload: { i18nName: 'ETag' },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getI18nListMock.mockImplementation(() => throwError({ response: { messageKey: 'some api error' } }));
        const action$ = hot('-a', {
          a: { type: getI18nListRequest.type },
        }) as any;
        const output$ = getI18nListEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getI18nListError.type,
            payload: {
              message: 'some api error',
              type: 'NOTIFICATION',
            },
          },
        });
      });
    });
  });

  describe('getI18nByNameEpic', () => {
    it('should call success action', () => {
      const response = { response: { 'some key': 'some value' }, xhr: { getResponseHeader: () => 'ETag' } };
      testScheduler.run(({ hot, cold, expectObservable }) => {
        getI18nByNameMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: {
            type: getI18nByNameRequest.type,
            payload: { name: 'en', versionId: 'master' },
          },
        }) as any;
        const output$ = getI18nByNameEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: getI18nByNameSuccess.type,
            payload: '{\n    "some key": "some value"\n}',
          },
          b: {
            type: setI18nETags.type,
            payload: { en: 'ETag' },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getI18nByNameMock.mockImplementation(() => throwError({ response: { messageKey: 'some api error' } }));
        const action$ = hot('-a', {
          a: {
            type: getI18nByNameRequest.type,
            payload: { name: 'en', versionId: 'master' },
          },
        }) as any;
        const output$ = getI18nByNameEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getI18nByNameError.type,
            payload: {
              message: 'some api error',
              type: 'NOTIFICATION',
            },
          },
        });
      });
    });
  });

  describe('deleteI18nEpic', () => {
    const testVersionId = '42';
    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: { title: 'title' },
        });
        deleteI18nMock.mockReturnValue(
          cold('--a', { a: { response: {} } }),
        );
        const action$ = hot('-a', {
          a: {
            type: deleteI18nRequest.type,
            payload: { id: 'id', title: 'title', versionId: 'master' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { name: 'tag' } } };
        const output$ = deleteI18nEpic(action$, state$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: deleteI18nSuccess.type,
            payload: 'master',
          },
          b: {
            type: setHasConflicts.type,
            payload: false,
          },
        });
      });
    });
    it('should call success action with candidate version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: { title: 'title' },
        });
        deleteI18nMock.mockReturnValue(
          cold('--a', { a: { response: {} } }),
        );
        const action$ = hot('-a', {
          a: {
            type: deleteI18nRequest.type,
            payload: { name: 'name', title: 'title', versionId: testVersionId },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { name: 'tag' } } };
        const output$ = deleteI18nEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: deleteI18nSuccess.type,
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
        deleteI18nMock.mockImplementation(() => throwError({
          response: {
            messageKey: 'some message key {{bundleName}}',
            messageParameters: {
              bundleName: 'en',
            },
          },
        }));
        const action$ = hot('-a', {
          a: {
            type: deleteI18nRequest.type,
            payload: { id: 'id', title: 'title' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { name: 'tag' } } };
        const output$ = deleteI18nEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: deleteI18nError.type,
            payload: {
              type: 'NOTIFICATION',
              message: 'some message key EN - English',
            },
          },
        });
      });
    });
    it('should call error action with 409 error response', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        deleteI18nMock.mockImplementation(() => throwError({ status: 409 }));
        const action$ = hot('-a', {
          a: {
            type: deleteI18nRequest.type,
            payload: { name: 'name', title: 'title' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { name: 'tag' } } };
        const output$ = deleteI18nEpic(action$, state$);

        expectObservable(output$).toBe('-(ab)', {
          a: {
            type: deleteI18nError.type,
            payload: { status: 409 },
          },
          b: {
            type: setHasConflicts.type,
            payload: true,
          },
        });
      });
    });
  });

  describe('createI18nEpic', () => {
    beforeEach(() => {
      notifyMock.mockImplementation((message, type) => ({ message, type } as any));
    });
    const testVersionId = '42';
    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        createI18nMock.mockReturnValue(
          cold('--a', { a: { response: { title: 'title' }, xhr: { getResponseHeader: () => 'ETag' } } }),
        );
        const action$ = hot('-a', {
          a: {
            type: createI18nRequest.type,
            payload: { versionId: 'master', name: 'en', i18nContent: 'some content' },
          },
        }) as any;
        const output$ = createI18nEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: createI18nSuccess.type,
            payload: 'master',
          },
          b: {
            type: setHasConflicts.type,
            payload: false,
          },
        });
      });
    });
    it('should call success action with candidate version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        createI18nMock.mockReturnValue(
          cold('--a', { a: { response: { title: 'title' }, xhr: { getResponseHeader: () => 'ETag' } } }),
        );
        const action$ = hot('-a', {
          a: {
            type: createI18nRequest.type,
            payload: { versionId: testVersionId, name: 'en', i18nContent: 'some content' },
          },
        }) as any;
        const output$ = createI18nEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: createI18nSuccess.type,
            payload: testVersionId,
          },
          b: {
            type: 'success',
            message: i18next.t('domains~i18n.notifications.success.createI18n.message'),
          },
        });
      });
    });
    it('should call error action ', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        createI18nMock.mockImplementation(() => throwError({
          response: {
            messageKey: 'some api error',
          },
        }));
        const action$ = hot('-a', {
          a: {
            type: createI18nRequest.type,
            payload: { id: 1, name: 'en', i18nContent: 'some content' },
          },
        }) as any;
        const output$ = createI18nEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: createI18nError.type,
            payload: {
              message: 'some api error',
              type: 'NOTIFICATION',
            },
          },
        });
      });
    });
  });

  describe('updateI18nEpic', () => {
    beforeEach(() => {
      notifyMock.mockImplementation((message, type) => ({ message, type } as any));
    });
    const testVersionId = '42';
    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        updateI18nMock.mockReturnValue(
          cold('--a', { a: { response: { title: 'title' }, xhr: { getResponseHeader: () => 'ETag' } } }),
        );
        const action$ = hot('-a', {
          a: {
            type: updateI18nRequest.type,
            payload: { versionId: 'master', name: 'en', i18nContent: 'some content' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { en: 'tag' } } };
        const output$ = updateI18nEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: updateI18nSuccess.type,
            payload: 'master',
          },
          b: {
            type: setI18nETags.type,
            payload: { en: 'ETag' },
          },
          c: {
            type: setHasConflicts.type,
            payload: false,
          },
        });
      });
    });
    it('should call success action with candidate version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        updateI18nMock.mockReturnValue(
          cold('--a', { a: { response: { title: 'title' }, xhr: { getResponseHeader: () => 'ETag' } } }),
        );
        const action$ = hot('-a', {
          a: {
            type: updateI18nRequest.type,
            payload: { versionId: testVersionId, name: 'en', i18nContent: 'some content' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { name: 'tag' } } };
        const output$ = updateI18nEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: updateI18nSuccess.type,
            payload: testVersionId,
          },
          b: {
            type: setI18nETags.type,
            payload: { en: 'ETag' },
          },
          c: {
            type: 'success',
            message: i18next.t('domains~i18n.notifications.success.updateI18n.message'),
          },
        });
      });
    });
    it('should call error action ', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateI18nMock.mockImplementation(() => throwError({
          response: {
            messageKey: 'some api error',
          },
        }));
        const action$ = hot('-a', {
          a: {
            type: updateI18nRequest.type,
            payload: { id: 1, name: 'en', i18nContent: 'some content' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { name: 'tag' } } };
        const output$ = updateI18nEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: updateI18nError.type,
            payload: {
              message: 'some api error',
              type: 'NOTIFICATION',
            },
          },
        });
      });
    });
    it('should call error action with 409 error response', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateI18nMock.mockImplementation(() => throwError({ status: 409 }));
        const action$ = hot('-a', {
          a: {
            type: updateI18nRequest.type,
            payload: { versionId: testVersionId, name: 'en', i18nContent: 'some content' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { i18n: { eTags: { name: 'tag' } } };
        const output$ = updateI18nEpic(action$, state$);

        expectObservable(output$).toBe('-(ab)', {
          a: {
            type: updateI18nError.type,
            payload: { status: 409 },
          },
          b: {
            type: setHasConflicts.type,
            payload: true,
          },
        });
      });
    });
  });

  describe('refreshI18nListEpic', () => {
    it('should refresh existing i18n list on successful delete when removing from master', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('-a', {
          a: {
            type: deleteI18nSuccess.type,
            payload: MASTER_VERSION_ID,
          },
        }) as any;
        const output$ = refreshI18nListEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getI18nListRequest.type,
            payload: MASTER_VERSION_ID,
          },
        });
      });
    });
  });
});
