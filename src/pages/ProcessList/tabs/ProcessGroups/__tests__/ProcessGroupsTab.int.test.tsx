import React from 'react';
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { screen, portalRender } from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';
import {
  getProcessGroupDataRequest,
  getProcessGroupDataClean,
  selectGroupDataError,
} from 'store/processGroups';

import ProcessGroupsTab from '../ProcessGroupsTab';

vi.mock('#web-components/components/GroupedEntityList', () => ({
  default: () => <div data-xpath="grouped-entity-list" />,
}));

vi.mock('#shared/utils/RouterPrompt', () => ({
  default: () => null,
}));

vi.mock('store/processGroups', async (importOriginal) => {
  const original = await importOriginal<typeof import('store/processGroups')>();
  return {
    ...original,
    selectGroupDataError: vi.fn(),
  };
});

const selectGroupDataErrorMock = selectGroupDataError as unknown as vi.Mock;

const mockState = getCommonReduxMockState({
  processGroups: {
    groupData: { groups: [], ungrouped: [] },
    groupDataEdit: { groups: [], ungrouped: [] },
  },
});

describe('ProcessGroupsTab', () => {
  beforeEach(() => {
    selectGroupDataErrorMock.mockReturnValue(undefined);
  });

  describe('initial render', () => {
    it('should dispatch getProcessGroupDataRequest on mount', () => {
      const dispatchMock = vi.fn();
      portalRender(<ProcessGroupsTab />, { preloadedState: mockState, dispatchMock });
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getProcessGroupDataRequest.type }),
      );
    });

    it('should render GroupedEntityList', () => {
      portalRender(<ProcessGroupsTab />, { preloadedState: mockState });
      expect(screen.getByTestId('grouped-entity-list')).toBeInTheDocument();
    });
  });

  describe('cleanup', () => {
    it('should dispatch getProcessGroupDataClean on unmount', () => {
      const dispatchMock = vi.fn();
      const { unmount } = portalRender(<ProcessGroupsTab />, { preloadedState: mockState, dispatchMock });
      unmount();
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getProcessGroupDataClean.type }),
      );
    });
  });

  describe('error state', () => {
    it('should render ComponentError when selectGroupDataError returns a string', () => {
      selectGroupDataErrorMock.mockReturnValue('Failed to load process groups');
      portalRender(<ProcessGroupsTab />, { preloadedState: mockState });
      expect(screen.getByText('Failed to load process groups')).toBeInTheDocument();
    });
  });
});
