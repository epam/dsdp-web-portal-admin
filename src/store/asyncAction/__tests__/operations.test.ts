import { TestScheduler } from 'rxjs/testing';
import { notify } from 'reapop';
import { ERROR_TYPE } from '#shared/types/common';
import { defaultNotificationErrorProps } from 'constants/errorProps';

import { handleNonCriticalErrorsEpic } from '../operations';

vi.mock('reapop', () => {
  return {
    notify: vi.fn(),
  };
});

const notifyMock = vi.mocked(notify);
let testScheduler: TestScheduler;

describe('asyncAction operations', () => {
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
    notifyMock.mockImplementation((message, type, params) => ({ message, type, params }));
  });

  describe('handleNonCriticalErrorsEpic', () => {
    it('should correctly parse default notification options', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('-a', {
          a: { type: 'SomethingError', payload: { type: ERROR_TYPE.NOTIFICATION } },
        }) as any;
        const output$ = handleNonCriticalErrorsEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            message: defaultNotificationErrorProps().message,
            type: 'error',
            params: expect.objectContaining({ title: defaultNotificationErrorProps().componentProps.title }),
          },
        });
      });
    });

    it('should correctly use passed notification options', () => {
      testScheduler.run(({ hot, expectObservable }) => {
        const action$ = hot('-a', {
          a: {
            type: 'SomethingError',
            payload: {
              type: ERROR_TYPE.NOTIFICATION,
              message: 'message',
              componentProps: { title: 'title' },
            },
          },
        }) as any;
        const output$ = handleNonCriticalErrorsEpic(action$);

        expectObservable(output$).toBe('-a', {
          a: {
            message: 'message',
            type: 'error',
            params: expect.objectContaining({ title: 'title' }),
          },
        });
      });
    });
  });
});
