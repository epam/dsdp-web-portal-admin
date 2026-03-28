import React from 'react';

import {
  vi, describe, it, expect,
} from 'vitest';
import { getProcessByNameRequest } from 'store/process';
import { getCommonReduxMockState } from 'utils/testUtils';
import { portalRender } from '#shared/utils/testUtils';

import CreateProcessPage from '../CreateProcessPage';

const createState = () => {
  return getCommonReduxMockState({
    process: {
      process: 'process string',
    },
  });
};

describe('CreateProcessPage', () => {
  describe('initial render', () => {
    it('should get initial data', () => {
      const dispatchMock = vi.fn();
      const initialData = {
        processItem: {
          id: '1',
          name: 'Process 1',
        },
      };

      portalRender(<CreateProcessPage />, {
        preloadedState: createState(),
        dispatchMock,
        locationSettings: { state: initialData },
      });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: getProcessByNameRequest.type }));
    });
  });
});
