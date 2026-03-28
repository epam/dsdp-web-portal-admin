import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { getCommonReduxMockState } from 'utils/testUtils';
import { isMaster } from 'utils/versions';
import { portalRender, fireEvent } from '#shared/utils/testUtils';
import { ERROR_TYPE } from '#shared/types/common';
import TableStructureEditor from '../TableStructureEditor';

const mockState = getCommonReduxMockState({
  tables: {},
});

vi.mock('utils/versions', () => {
  return {
    isMaster: vi.fn(),
  };
});

const isMasterMock = vi.mocked(isMaster);

describe('TableStructureEditor', () => {
  it('should be defined', () => {
    const wrapper = portalRender(<TableStructureEditor />, { preloadedState: mockState });
    expect(wrapper).toBeDefined();
  });

  it('should be render group buttons', () => {
    isMasterMock.mockReturnValue(false);
    const wrapper = portalRender(<TableStructureEditor />, { preloadedState: mockState });
    expect(wrapper.getByText('actions.expand')).toBeInTheDocument();
    expect(wrapper.getByText('actions.saveChanges')).toBeInTheDocument();
    expect(wrapper.getByText('actions.undoChanges')).toBeInTheDocument();
  });

  it('should not be render group buttons', () => {
    isMasterMock.mockReturnValue(true);
    const wrapper = portalRender(<TableStructureEditor />, { preloadedState: mockState });
    expect(wrapper.getByText('actions.expand')).toBeInTheDocument();
    expect(wrapper.queryByText('actions.saveChanges')).not.toBeInTheDocument();
    expect(wrapper.queryByText('actions.undoChanges')).not.toBeInTheDocument();
  });

  it('should switch to fullscreen mode with group buttons', () => {
    isMasterMock.mockReturnValue(false);
    const wrapper = portalRender(<TableStructureEditor />, { preloadedState: mockState });
    expect(wrapper.getByText('actions.expand')).toBeInTheDocument();

    fireEvent.click(wrapper.getByText('actions.expand'));
    expect(wrapper.getByText('actions.collapse')).toBeInTheDocument();
    expect(wrapper.getAllByText('actions.saveChanges').length).toBe(2);
    expect(wrapper.getAllByText('actions.undoChanges').length).toBe(2);

    fireEvent.click(wrapper.getByText('actions.collapse'));
    expect(wrapper.queryByText('actions.expand')).toBeInTheDocument();
  });

  it('should switch to fullscreen mode without group buttons', () => {
    isMasterMock.mockReturnValue(true);
    const wrapper = portalRender(<TableStructureEditor />, { preloadedState: mockState });
    expect(wrapper.getByText('actions.expand')).toBeInTheDocument();

    fireEvent.click(wrapper.getByText('actions.expand'));
    expect(wrapper.getByText('actions.collapse')).toBeInTheDocument();
    expect(wrapper.queryByText('actions.saveChanges')).not.toBeInTheDocument();
    expect(wrapper.queryByText('actions.undoChanges')).not.toBeInTheDocument();

    fireEvent.click(wrapper.getByText('actions.collapse'));
    expect(wrapper.queryByText('actions.expand')).toBeInTheDocument();
  });

  it('should render error', () => {
    const wrapper = portalRender(<TableStructureEditor />, {
      preloadedState: {
        ...mockState,
        asyncAction: {
          asyncActionMap: {
            'table/getDataModel': {
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
