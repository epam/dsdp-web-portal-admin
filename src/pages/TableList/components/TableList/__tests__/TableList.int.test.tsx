import React from 'react';
import {
  vi, describe, it, expect,
} from 'vitest';

import { getTableListRequest } from 'store/tables';
import { getCommonReduxMockState } from 'utils/testUtils';
import { isMaster } from 'utils/versions';
import { portalRender } from '#shared/utils/testUtils';

import { ERROR_TYPE } from '#shared/types/common';
import TableList from '../TableList';

vi.mock('utils/versions', async (importOriginal) => {
  return {
    ...await importOriginal(),
    isMaster: vi.fn(),
  };
});

const mockState = getCommonReduxMockState({
  tables: {
    list: [
      {
        name: 'name',
        description: 'description',
        objectReference: true,
        historyFlag: true,
      },
    ],
    table: {},
  },
});

const isMasterMock = vi.mocked(isMaster);

describe.skip('TableList', () => {
  describe('initial render', () => {
    it('should get initial data', () => {
      const dispatchMock = vi.fn();
      portalRender(<TableList />, { preloadedState: mockState, dispatchMock });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: getTableListRequest.type,
      }));
    });
  });

  describe('display an empty placeholder in the table', () => {
    const mockState2 = getCommonReduxMockState({
      tables: {
        list: [],
        table: {},
      },
    });
    it('master version', () => {
      isMasterMock.mockReturnValue(true);
      const wrapper = portalRender(<TableList />, { preloadedState: mockState2 });
      expect(wrapper.getByText('table.emptyPlaceholder')).toBeInTheDocument();
    });
    it('candidate version', () => {
      isMasterMock.mockReturnValue(false);
      const wrapper = portalRender(<TableList />, { preloadedState: mockState2 });
      expect(wrapper.getByText('table.emptyPlaceholderCandidates')).toBeInTheDocument();
    });
  });

  it('should render error', () => {
    const wrapper = portalRender(<TableList />, {
      preloadedState: {
        ...mockState,
        asyncAction: {
          asyncActionMap: {
            'table/getList': {
              isLoading: false,
              isLoaded: false,
              errors: [{
                type: ERROR_TYPE.COMPONENT,
                message: 'error text',
              },
              ],
            },
          },
        },
      },
    });
    expect(wrapper.getByText('⚠️')).toBeInTheDocument();
    expect(wrapper.getByText('error text')).toBeInTheDocument();
  });
});
