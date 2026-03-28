import {
  vi, describe, it, expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/processes';
import { throwError } from 'rxjs';
import { tryAgainNotificationErrorProps } from 'constants/errorProps';
import { AjaxError } from 'rxjs/ajax';
import i18next from 'i18next';
import { notify } from 'reapop';
import { ERROR_TYPE } from '#shared/types/common';
import {
  getProcessGroupDataEpic, saveProcessGroupDataEpic,
} from '../operations';
import {
  getProcessGroupDataRequest,
  getProcessGroupDataSuccess,
  getProcessGroupDataError,
  saveProcessGroupDataRequest,
  saveProcessGroupDataSuccess,
  saveProcessGroupDataError,
} from '../slice';

vi.mock('api/processes', () => {
  return {
    getProcessGroups: vi.fn(),
    saveProcessGroups: vi.fn(),
  };
});

vi.mock('reapop', () => {
  return {
    notify: vi.fn(),
  };
});

let testScheduler: TestScheduler;
const getProcessGroupsMock = vi.mocked(api.getProcessGroups);
const saveProcessGroupsMock = vi.mocked(api.saveProcessGroups);
const notifyMock = vi.mocked(notify);

describe('process groups', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getProcessGroupDataEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getProcessGroupsMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getProcessGroupDataRequest.type },
        }) as any;
        const output$ = getProcessGroupDataEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getProcessGroupDataSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getProcessGroupsMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getProcessGroupDataRequest.type },
        }) as any;
        const output$ = getProcessGroupDataEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getProcessGroupDataError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
    it('should call error action with 500 status', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getProcessGroupsMock.mockImplementation(() => throwError({ status: 500 } as AjaxError));
        const action$ = hot('-a', {
          a: { type: getProcessGroupDataRequest.type },
        }) as any;
        const output$ = getProcessGroupDataEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getProcessGroupDataError.type,
            payload: i18next.t('pages~processList.error.wrongStructure'),
          },
        });
      });
    });
  });

  describe('saveProcessGroupDataEpic', () => {
    beforeEach(() => {
      notifyMock.mockImplementation((message, type) => ({ message, type } as any));
    });
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        saveProcessGroupsMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: saveProcessGroupDataRequest.type, payload: { groupData: {}, versionId: 'id' } },
        }) as any;
        const output$ = saveProcessGroupDataEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: saveProcessGroupDataSuccess.type,
          },
          b: {
            message: i18next.t('pages~processList.processGroupsTab.messages.saveSuccess'),
            type: 'success',
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        saveProcessGroupsMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: saveProcessGroupDataRequest.type, payload: { groupData: {}, versionId: 'id' } },
        }) as any;
        const output$ = saveProcessGroupDataEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: saveProcessGroupDataError.type,
            payload: tryAgainNotificationErrorProps(),
          },
        });
      });
    });
    it('should call error action with 422 status', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        saveProcessGroupsMock.mockImplementation(() => throwError({ status: 422 } as AjaxError));
        const action$ = hot('-a', {
          a: { type: saveProcessGroupDataRequest.type, payload: { groupData: {}, versionId: 'id' } },
        }) as any;
        const output$ = saveProcessGroupDataEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: saveProcessGroupDataError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
              message: i18next.t('pages~processList.processGroupsTab.messages.saveError'),
              componentProps: {
                title: i18next.t('pages~processList.processGroupsTab.messages.saveErrorTitle'),
              },
            },
          },
        });
      });
    });
  });
});
