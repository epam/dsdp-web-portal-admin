import {
  vi,
  describe,
  beforeEach,
  it,
  expect,
} from 'vitest';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/settings';
import { throwError } from 'rxjs';
import { ERROR_TYPE } from '#shared/types/common';
import { notify } from 'reapop';

import {
  getSettingsRequest,
  getSettingsError,
  getSettingsSuccess,
  updateSettingsRequest,
  updateSettingsError,
  updateSettingsSuccess,
  getMasterSupportEmailRequest,
  getMasterSupportEmailError,
  getMasterSupportEmailSuccess,
} from '../slice';
import {
  getSettingsEpic,
  updateSettingsEpic,
  getMasterSupportEmailEpic,
} from '../operations';

vi.mock('api/settings', () => {
  return {
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
  };
});

vi.mock('reapop', () => {
  return {
    notify: vi.fn(),
  };
});

const getSettingsMock = vi.mocked(api.getSettings);
const updateSettingsMock = vi.mocked(api.updateSettings);
const notifyMock = vi.mocked(notify);

let testScheduler: TestScheduler;

describe('settings operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  describe('getSettingsEpic', () => {
    it('should call success action', () => {
      const response = { response: {} };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getSettingsMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getSettingsRequest.type },
        }) as any;
        const output$ = getSettingsEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getSettingsSuccess.type,
            payload: {},
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getSettingsMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getSettingsRequest.type },
        }) as any;
        const output$ = getSettingsEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getSettingsError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('updateSettingsEpic', () => {
    it('should call success action', () => {
      testScheduler.run(({ hot, cold, expectObservable }) => {
        notifyMock.mockReturnValue({
          type: 'success',
          payload: {},
        } as any);
        updateSettingsMock.mockReturnValue(
          cold('--a', {
            a: {} as any,
          }),
        );
        const action$ = hot('-a', {
          a: {
            type: updateSettingsRequest.type,
            payload: {
              versionsId: '',
              settings: {},
            },
          },
        }) as any;

        const output$ = updateSettingsEpic(action$);

        expectObservable(output$).toBe('---(ab)', {
          a: {
            type: updateSettingsSuccess.type,
          },
          b: {
            type: 'success',
            payload: {},
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        updateSettingsMock.mockImplementation(() => throwError({ response: { errors: {} } }));
        const action$ = hot('-a', {
          a: {
            type: updateSettingsRequest.type,
            payload: {
              name: 'title',
              description: 'description',
            },
          },
        }) as any;

        const output$ = updateSettingsEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: updateSettingsError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });

  describe('getMasterSupportEmailEpic', () => {
    it('should call success action', () => {
      const response = { response: {} };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getSettingsMock.mockReturnValue(cold('--a', { a: response as any }));
        const action$ = hot('-a', {
          a: { type: getMasterSupportEmailRequest.type },
        }) as any;
        const output$ = getMasterSupportEmailEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getMasterSupportEmailSuccess.type,
            payload: {},
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getSettingsMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getMasterSupportEmailRequest.type },
        }) as any;
        const output$ = getMasterSupportEmailEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getMasterSupportEmailError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });
});
