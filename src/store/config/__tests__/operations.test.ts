import {
  vi, describe, expect, it, beforeEach,
} from 'vitest';
import { notify } from 'reapop';
import { TestScheduler } from 'rxjs/testing';
import * as api from 'api/config';
import { throwError } from 'rxjs';
import { ERROR_TYPE } from '#shared/types/common';
import { getBpModelerTemplatesError, getBpModelerTemplatesRequest, getBpModelerTemplatesSuccess } from '../slice';
import { getBpModelerTemplatesEpic } from '../operations';

const notifyMock = vi.mocked(notify);

let testScheduler: TestScheduler;

vi.mock('reapop', async (importOriginal) => {
  const reapop: typeof import('reapop') = await importOriginal();
  return {
    ...reapop,
    notify: vi.fn(),
  };
});
vi.mock('api/config', () => {
  return {
    getBpModelerTemplates: vi.fn(),
  };
});

const getBpModelerTemplatesMock = vi.mocked(api.getBpModelerTemplates);

describe('Config operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    notifyMock.mockImplementation((message, type, title) => ({
      message,
      type,
      title,
    }));
  });
  describe('getBpModelerTemplatesEpic', () => {
    it('should call success action', () => {
      const response = { response: [] };

      testScheduler.run(({ hot, cold, expectObservable }) => {
        getBpModelerTemplatesMock.mockReturnValue(cold('--a', { a: response } as any));
        const action$ = hot('-a', {
          a: { type: getBpModelerTemplatesRequest.type },
        }) as any;
        const output$ = getBpModelerTemplatesEpic(action$);

        expectObservable(output$).toBe('---a', {
          a: {
            type: getBpModelerTemplatesSuccess.type,
            payload: [],
          },
        });
      });
    });
    it('should call error action', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        getBpModelerTemplatesMock.mockImplementation(() => throwError(new Error('some api error')));
        const action$ = hot('-a', {
          a: { type: getBpModelerTemplatesRequest.type },
        }) as any;
        const output$ = getBpModelerTemplatesEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            type: getBpModelerTemplatesError.type,
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
            },
          },
        });
      });
    });
  });
});
