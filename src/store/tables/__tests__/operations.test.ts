import {
  vi,
  describe,
  beforeEach,
  it,
  expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/tables';
import { throwError } from 'rxjs';
import { tryAgainNotificationErrorProps } from 'constants/errorProps';
import { AjaxError } from 'rxjs/ajax';
import i18n from 'localization';
import { ERROR_TYPE } from '#shared/types/common';
import { notify } from 'reapop';
import i18next from 'i18next';
import {
  getTableByNameError,
  getTableByNameRequest,
  getTableByNameSuccess,
  getTableListError,
  getTableListRequest,
  getTableListSuccess,
  getTableDataModelRequest,
  getTableDataModelSuccess,
  getTableDataModelError,
  updateTableDataModelRequest,
  updateTableDataModelSuccess,
  updateTableDataModelError,
} from '../slice';
import {
  getTableByNameEpic,
  getTablesListEpic,
  getTableDataModelEpic,
  updateTableDataModelEpic,
} from '../operations';

vi.mock('api/tables', () => {
  return {
    getTableList: vi.fn(),
    getTableByName: vi.fn(),
    getTableDataModel: vi.fn(),
    updateTableDataModel: vi.fn(),
  };
});

vi.mock('reapop', () => {
  return {
    notify: vi.fn(),
  };
});

let testScheduler: TestScheduler;
const notifyMock = vi.mocked(notify);
const getTableListMock = vi.mocked(api.getTableList);
const getTableByNameMock = vi.mocked(api.getTableByName);
const getTableDataModelMock = vi.mocked(api.getTableDataModel);
const updateTableDataModelMock = vi.mocked(api.updateTableDataModel);

describe('Tables operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getTableListEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getTableListMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getTableListRequest.type },
        }) as any;
        const output$ = getTablesListEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getTableListSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getTableListMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getTableListRequest.type },
        }) as any;
        const output$ = getTablesListEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getTableListError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });

    it('should call error action with 404 status', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getTableListMock.mockImplementation(() => throwError({ status: 404 } as AjaxError));
        const action$ = hot('--a', {
          a: { type: getTableListRequest.type },
        }) as any;
        const output$ = getTablesListEpic(action$);

        expectObservable(output$).toBe('--a', {
          a: {
            type: getTableListError.type,
            payload: {
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.notFound'),
            },
          },
        });
      });
    });
    it('should call error action with 500 status', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getTableListMock.mockImplementation(() => throwError({ status: 500 } as AjaxError));
        const action$ = hot('--a', {
          a: { type: getTableListRequest.type },
        }) as any;
        const output$ = getTablesListEpic(action$);

        expectObservable(output$).toBe('--a', {
          a: {
            type: getTableListError.type,
            payload: {
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.server'),
            },
          },
        });
      });
    });
  });

  describe('getTableByNameEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getTableByNameMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getTableByNameRequest.type, payload: { name: 'name', versionId: 'versId' } },
        }) as any;
        const output$ = getTableByNameEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getTableByNameSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getTableByNameMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('--a', {
          a: { type: getTableByNameRequest.type, payload: { name: 'name', versionId: 'versId' } },
        }) as any;
        const output$ = getTableByNameEpic(action$);

        expectObservable(output$).toBe('--a', {
          a: {
            type: getTableByNameError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
  });

  describe('getTableDataModelEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getTableDataModelMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getTableDataModelRequest.type, payload: 'versId' },
        }) as any;
        const output$ = getTableDataModelEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getTableDataModelSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getTableDataModelMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('--a', {
          a: { type: getTableDataModelRequest.type, payload: 'versId' },
        }) as any;
        const output$ = getTableDataModelEpic(action$);

        expectObservable(output$).toBe('--a', {
          a: {
            type: getTableDataModelError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
    it('should call error action with 404 status', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getTableDataModelMock.mockImplementation(() => throwError({ status: 404 } as AjaxError));
        const action$ = hot('--a', {
          a: { type: getTableDataModelRequest.type, payload: 'versId' },
        }) as any;
        const output$ = getTableDataModelEpic(action$);

        expectObservable(output$).toBe('--a', {
          a: {
            type: getTableDataModelError.type,
            payload: {
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.notFound'),
            },
          },
        });
      });
    });
    it('should call error action with 500 status', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getTableDataModelMock.mockImplementation(() => throwError({ status: 500 } as AjaxError));
        const action$ = hot('--a', {
          a: { type: getTableDataModelRequest.type, payload: 'versId' },
        }) as any;
        const output$ = getTableDataModelEpic(action$);

        expectObservable(output$).toBe('--a', {
          a: {
            type: getTableDataModelError.type,
            payload: {
              type: ERROR_TYPE.COMPONENT,
              message: i18n.t('pages~tableList.error.server'),
            },
          },
        });
      });
    });
  });

  describe('updateTableDataModelEpic', () => {
    beforeEach(() => {
      notifyMock.mockImplementation((message: string, type: string) => ({ message, type } as any));
    });
    it('should call success action', () => {
      const response = { response: 'xml' };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        updateTableDataModelMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: {
            type: updateTableDataModelRequest.type,
            payload: { xml: 'xml', versionId: 'versionId' },
          },
        }) as any;
        const output$ = updateTableDataModelEpic(action$);
        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: updateTableDataModelSuccess.type,
            payload: 'xml',
          },
          b: {
            message: i18next.t('pages~tableList.text.currentChangesSavedSuccessfully'),
            type: 'success',
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateTableDataModelMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: {
            type: updateTableDataModelRequest.type,
            payload: { xml: 'xml', versionId: 'versionId' },
          },
        }) as any;
        const output$ = updateTableDataModelEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: updateTableDataModelError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
  });
});
