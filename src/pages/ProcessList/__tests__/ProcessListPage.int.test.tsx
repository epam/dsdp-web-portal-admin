import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { getCommonReduxMockState } from 'utils/testUtils';
import { getProcessListRequest } from 'store/process';
import { portalRender } from '#shared/utils/testUtils';

import ProcessListPage from '../ProcessListPage';

const mockState = getCommonReduxMockState({
  process: {
    list: [
      {
        name: '',
        title: '',
        created: '2022-11-09',
        updated: '2022-11-09',
      },
      {
        name: '',
        title: '',
        created: '2022-11-09',
        updated: '2022-11-08',
      },
    ],
  },
});

describe('ProcessListPage', () => {
  describe('initial render', () => {
    it('should get initial data', () => {
      const dispatchMock = vi.fn();
      portalRender(<ProcessListPage />, { preloadedState: mockState, dispatchMock });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: getProcessListRequest.type,
      }));
    });
  });
});
