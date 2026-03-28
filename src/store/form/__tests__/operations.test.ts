import {
  vi, describe, it, expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/forms';
import { downloadObjectAsJson, formatFormForExport } from 'utils';
import { throwError } from 'rxjs';
import { ERROR_TYPE } from '#shared/types/common';
import i18n from 'localization';
import { notify } from 'reapop';
import { ROUTES } from 'constants/routes';
import i18next from 'i18next';
import { MASTER_VERSION_ID } from 'constants/common';
import { BROWSER_PUSH_ACTION_TYPE } from 'utils/common';
import {
  createFormEpic,
  getFormListEpic,
  exportFormEpic,
  getFormByNameEpic,
  updateFormEpic,
  deleteFormEpic,
  refreshFormListEpic,
} from '../operations';
import {
  getFormListRequest,
  getFormListError,
  getFormListSuccess,
  createFormError,
  createFormRequest,
  createFormSuccess,
  exportFormRequest,
  exportFormSuccess,
  exportFormError,
  getFormByNameRequest,
  getFormByNameSuccess,
  getFormByNameError,
  updateFormRequest,
  updateFormSuccess,
  updateFormError,
  deleteFormRequest,
  deleteFormError,
  deleteFormSuccess,
  setHasConflicts,
  setFormETags,
} from '../slice';
import { tryAgainNotificationErrorProps } from '../../../constants/errorProps';

vi.mock('api/forms', () => {
  return {
    getFormList: vi.fn(),
    createForm: vi.fn(),
    getFormByName: vi.fn(),
    updateForm: vi.fn(),
    deleteForm: vi.fn(),
  };
});

vi.mock('reapop', () => {
  return {
    notify: vi.fn(),
  };
});
vi.mock('utils', () => {
  return {
    downloadObjectAsJson: vi.fn(),
    formatFormForExport: vi.fn(),
    removeCustomClass: vi.fn(),
  };
});

const getFormListMock = vi.mocked(api.getFormList);
const downloadObjectAsJsonMock = vi.mocked(downloadObjectAsJson);
const formatFormForExportMock = vi.mocked(formatFormForExport);
const createFormMock = vi.mocked(api.createForm);
const getFormByNameMock = vi.mocked(api.getFormByName);
const updateFormMock = vi.mocked(api.updateForm);
const deleteFormMock = vi.mocked(api.deleteForm);
const notifyMock = vi.mocked(notify);
let testScheduler: TestScheduler;

describe('form operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getFormListEpic', () => {
    it('should call success action', () => {
      const response = { response: [{ name: 'formName', ETag: 'ETag' }] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getFormListMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: { type: getFormListRequest.type },
        }) as any;
        const output$ = getFormListEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: getFormListSuccess.type,
            payload: [{ name: 'formName', ETag: 'ETag' }],
          },
          b: {
            type: setFormETags.type,
            payload: { formName: 'ETag' },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getFormListMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getFormListRequest.type },
        }) as any;
        const output$ = getFormListEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getFormListError.type,
            payload: { message: 'some api error' },
          },
        });
      });
    });
  });

  describe('createFormEpic', () => {
    const testVersionId = '42';
    const formName = 'formName';

    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: {
            title: 'title',
          },
        });
        createFormMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
                components: [],
              },
            },
          }),
        );
        const action$ = hot('-a', {
          a: {
            type: createFormRequest.type,
            payload: {
              versionId: 'master',
              data: {
                title: 'title',
                components: [],
              },
            },
          },
        }) as any;
        const output$ = createFormEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: createFormSuccess.type,
            payload: undefined,
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
          payload: {
            title: 'title',
          },
        });
        createFormMock.mockReturnValue(
          cold('--a', {
            a: {
              response: {
                title: 'title',
                components: [],
                name: formName,
              },
            },
          }),
        );
        const action$ = hot('-a', {
          a: {
            type: createFormRequest.type,
            payload: {
              versionId: testVersionId,
              data: {
                title: 'title',
                components: [],
                name: formName,
              },
            },
          },
        }) as any;
        const output$ = createFormEpic(action$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: createFormSuccess.type,
            payload: undefined,
          },
          b: {
            type: 'success',
            payload: { title: 'title' },
          },
          c: {
            type: BROWSER_PUSH_ACTION_TYPE,
            payload: {
              path: ROUTES.EDIT_FORM.replace(':versionId', testVersionId).replace(':formId', formName),
            },
          },
        });
      });
    });
    it('should call error action with status 400 ', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        createFormMock.mockImplementation(() => throwError({ response: { messageKey: {} } }));
        const action$ = hot('-a', {
          a: {
            type: createFormRequest.type,
            payload: {
              versionId: testVersionId,
              data: {
                title: 'title',
                components: [],
              },
            },
          },
        }) as any;
        const output$ = createFormEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: createFormError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
              message: i18n.t(
                'domains~form.notifications.error.uniqueName.message',
              ),
              componentProps: {
                title: i18n.t(
                  'domains~form.notifications.error.uniqueName.title',
                ),
              },
            },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        createFormMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: createFormRequest.type,
            payload: {
              versionId: testVersionId,
              data: {
                title: 'title',
                components: [],
              },
            },
          },
        }) as any;
        const output$ = createFormEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: createFormError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
    it('should call error action with 409 error response', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        createFormMock.mockImplementation(() => throwError({ status: 409 }));
        const action$ = hot('-a', {
          a: {
            type: createFormRequest.type,
            payload: {
              versionId: testVersionId,
              data: {
                title: 'title',
                components: [],
              },
            },
          },
        }) as any;
        const output$ = createFormEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: createFormError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
              message: i18n.t('pages~createForm.notifications.error.conflict.message'),
              componentProps: {
                title: i18n.t('pages~createForm.notifications.error.conflict.title'),
              },
            },
          },
        });
      });
    });
  });

  describe('exportFormEpic', () => {
    it('should call success action', () => {
      const mockForm = { name: 'formName', someOtherFormProp: 'hello' };
      const response = { response: mockForm };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        downloadObjectAsJsonMock.mockReturnValue(cold('--a'));
        getFormByNameMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: {
            type: exportFormRequest.type,
            payload: mockForm,
          },
        }) as any;
        const output$ = exportFormEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: exportFormSuccess.type,
            payload: undefined,
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        const mockForm = { name: 'formName', someOtherFormProp: 'hello' };
        const response = { response: mockForm };

        getFormByNameMock.mockReturnValue(cold('--a', { a: response } as any));
        formatFormForExportMock.mockImplementation(() => {
          throw new Error('some conversion error');
        });
        const action$ = hot('-a', {
          a: {
            type: exportFormRequest.type,
            payload: mockForm,
          },
        }) as any;
        const output$ = exportFormEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: exportFormError.type,
            payload: new Error('some conversion error'),
          },
        });
      });
    });
  });

  describe('getFormByNameEpic', () => {
    it('should call success action', () => {
      const response = { response: {}, xhr: { getResponseHeader: () => 'ETag' } };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getFormByNameMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: { type: getFormByNameRequest.type, payload: { id: 1, name: 'formName' } },
        }) as any;
        const output$ = getFormByNameEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: getFormByNameSuccess.type,
            payload: {},
          },
          b: {
            type: setFormETags.type,
            payload: { formName: 'ETag' },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getFormByNameMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getFormByNameRequest.type, payload: { id: 1 } },
        }) as any;
        const output$ = getFormByNameEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getFormByNameError.type,
            payload: { message: 'some api error' },
          },
        });
      });
    });
  });

  describe('updateFormEpic', () => {
    beforeEach(() => {
      notifyMock.mockImplementation((message, type) => ({ message, type } as any));
    });
    const testVersionId = '42';
    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        updateFormMock.mockReturnValue(
          cold('--a', { a: { response: { title: 'title' }, xhr: { getResponseHeader: () => 'ETag' } } }),
        );
        const action$ = hot('-a', {
          a: {
            type: updateFormRequest.type,
            payload: { versionId: 'master', data: { title: 'title', name: 'formName', components: [] } },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = updateFormEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: updateFormSuccess.type,
            payload: undefined,
          },
          b: {
            type: setFormETags.type,
            payload: { formName: 'ETag' },
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
        updateFormMock.mockReturnValue(
          cold('--a', { a: { response: { title: 'title' }, xhr: { getResponseHeader: () => 'ETag' } } }),
        );
        const action$ = hot('-a', {
          a: {
            type: updateFormRequest.type,
            payload: { versionId: testVersionId, data: { title: 'title', name: 'formName', components: [] } },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = updateFormEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: updateFormSuccess.type,
          },
          b: {
            type: setFormETags.type,
            payload: { formName: 'ETag' },
          },
          c: {
            type: 'success',
            message: i18next.t('domains~form.notifications.success.updateForm.message'),
          },
        });
      });
    });
    it('should call error action with status 400 ', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateFormMock.mockImplementation(() => throwError({ response: { messageKey: {} } }));
        const action$ = hot('-a', {
          a: {
            type: updateFormRequest.type,
            payload: { id: 1, data: { title: 'title', components: [] } },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = updateFormEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: updateFormError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
              message: i18n.t(
                'domains~form.notifications.error.uniqueName.message',
              ),
              componentProps: {
                title: i18n.t(
                  'domains~form.notifications.error.uniqueName.title',
                ),
              },
            },
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateFormMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: updateFormRequest.type,
            payload: { versionId: testVersionId, data: { title: 'title', components: [] } },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = updateFormEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: updateFormError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
    it('should call error action with 409 error response', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateFormMock.mockImplementation(() => throwError({ status: 409 }));
        const action$ = hot('-a', {
          a: {
            type: updateFormRequest.type,
            payload: { versionId: testVersionId, data: { name: 'name', title: 'title', components: [] } },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = updateFormEpic(action$, state$);

        expectObservable(output$).toBe('-(ab)', {
          a: {
            type: updateFormError.type,
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

  describe('deleteFormEpic', () => {
    const testVersionId = '42';
    it('should call success action with master version', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: { title: 'title' },
        });
        deleteFormMock.mockReturnValue(
          cold('--a', { a: { response: {} } }),
        );
        const action$ = hot('-a', {
          a: {
            type: deleteFormRequest.type,
            payload: { id: 'id', title: 'title', versionId: 'master' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = deleteFormEpic(action$, state$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: deleteFormSuccess.type,
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
        deleteFormMock.mockReturnValue(
          cold('--a', { a: { response: {} } }),
        );
        const action$ = hot('-a', {
          a: {
            type: deleteFormRequest.type,
            payload: { id: 'id', title: 'title', versionId: testVersionId },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = deleteFormEpic(action$, state$);

        expectObservable(output$).toBe('---(abc)', {
          a: {
            type: deleteFormSuccess.type,
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
        deleteFormMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: deleteFormRequest.type,
            payload: { id: 'id', title: 'title' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = deleteFormEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: deleteFormError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
    it('should call error action with 409 error response', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        deleteFormMock.mockImplementation(() => throwError({ status: 409 }));
        const action$ = hot('-a', {
          a: {
            type: deleteFormRequest.type,
            payload: { name: 'name', id: 'id', title: 'title' },
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { eTags: { name: 'tag' } } };
        const output$ = deleteFormEpic(action$, state$);

        expectObservable(output$).toBe('-(ab)', {
          a: {
            type: deleteFormError.type,
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

  describe('refreshFormListEpic', () => {
    it('should refresh existing form list on successful delete when removing from master', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('-a', {
          a: {
            type: deleteFormSuccess.type,
            payload: MASTER_VERSION_ID,
          },
        }) as any;
        const state$ = hot('-a', {
          a: {},
        }) as any;
        state$.value = { form: { list: [{}] } };
        const output$ = refreshFormListEpic(action$, state$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getFormListRequest.type,
            payload: MASTER_VERSION_ID,
          },
        });
      });
    });
  });
});
