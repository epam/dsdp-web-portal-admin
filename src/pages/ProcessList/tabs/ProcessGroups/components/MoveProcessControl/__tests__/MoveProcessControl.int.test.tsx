import React from 'react';
import {
  describe, it, expect,
} from 'vitest';
import { fireEvent, portalRender, screen } from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';
import MoveProcessControl from '../MoveProcessControl';

const mockProcess = {
  name: 'test-process',
  title: 'Test Process',
} as any;

const mockState = getCommonReduxMockState({
  processGroups: {
    groupData: { groups: [], ungrouped: [] },
    groupDataEdit: { groups: [], ungrouped: [] },
  },
});

describe('MoveProcessControl', () => {
  describe('initial render', () => {
    it('should render without crashing', () => {
      portalRender(
        <MoveProcessControl process={mockProcess} />,
        { preloadedState: mockState },
      );
    });

    it('should render the move-to-folder button', () => {
      const wrapper = portalRender(
        <MoveProcessControl process={mockProcess} />,
        { preloadedState: mockState },
      );
      expect(wrapper.container.querySelector('button')).toBeInTheDocument();
    });
  });

  describe('modal', () => {
    it('should open MoveProcessModal when button is clicked', () => {
      const wrapper = portalRender(
        <MoveProcessControl process={mockProcess} />,
        { preloadedState: mockState },
      );
      const button = wrapper.container.querySelector('button');
      if (button) {
        fireEvent.click(button);
        expect(screen.getByText('modals.moveProcess.moveTitle')).toBeInTheDocument();
      }
    });

    it('should render with optional groupName and existingGroupNames', () => {
      portalRender(
        <MoveProcessControl
          process={mockProcess}
          groupName="existing-group"
          existingGroupNames={['existing-group', 'another-group']}
          moveToUngroupedEnable
        />,
        { preloadedState: mockState },
      );
    });
  });
});
