import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import {
  portalRender,
  screen,
  fireEvent,
  waitFor,
} from '#shared/utils/testUtils';
// import '@testing-library/jest-dom/extend-expect';
import { ProcessDefinition } from '#shared/types/processDefinition';
import MoveProcessModal from '../MoveProcessModal';

const mockProcess = {
  id: '1',
  name: 'Test Process',
} as ProcessDefinition;

const defaultProps = {
  existingGroupNames: ['Group 1', 'Group 2'],
  isOpen: true,
  process: mockProcess,
  onOpenChange: vi.fn(),
  onMoveToGroup: vi.fn(),
  onMoveToNewGroup: vi.fn(),
  onMoveToUngrouped: vi.fn(),
  text: {
    title: 'Move Process',
    description: 'Select a group to move the process to.',
    selectLabel: 'Select Group',
    groupFieldLabel: 'Group Name',
    moveButtonLabel: 'Move',
    placeholder: 'Select a group',
    existingGroupNamesLabel: 'Existing Groups',
    moveToNewGroup: 'Move to New Group',
    excludeFromGroup: 'Exclude from Group',
  },
};

describe('MoveProcessModal', () => {
  it('renders the modal with the correct title and description', () => {
    portalRender(<MoveProcessModal {...defaultProps} />);
    expect(screen.getByText('Move Process')).toBeInTheDocument();
    expect(screen.getByText('Select a group to move the process to.')).toBeInTheDocument();
  });

  it('opens the group selection menu when the select button is clicked', () => {
    portalRender(<MoveProcessModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Select a group'));
    expect(screen.getByText('Existing Groups')).toBeInTheDocument();
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Group 2')).toBeInTheDocument();
  });

  it('selects an existing group and enables the move button', () => {
    portalRender(<MoveProcessModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Select a group'));
    fireEvent.click(screen.getByText('Group 1'));
    expect(screen.getByText('Group 1')).toBeInTheDocument();
    expect(screen.getByText('Move')).not.toBeDisabled();
  });

  it('selects "Move to New Group" and shows the input field', () => {
    portalRender(<MoveProcessModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Select a group'));
    fireEvent.click(screen.getByText('Move to New Group'));
    expect(screen.getByText('Move to New Group')).toBeInTheDocument();
    expect(screen.getByText('Group Name')).toBeInTheDocument();
  });

  it('selects "Exclude from Group" and enables the move button', () => {
    portalRender(<MoveProcessModal {...defaultProps} moveToUngroupedEnable />);
    fireEvent.click(screen.getByText('Select a group'));
    fireEvent.click(screen.getByText('Exclude from Group'));
    expect(screen.getByText('Exclude from Group')).toBeInTheDocument();
    expect(screen.getByText('Move')).not.toBeDisabled();
  });

  it('calls onMoveToGroup when an existing group is selected and move button is clicked', async () => {
    const onMoveToGroup = vi.fn();
    portalRender(<MoveProcessModal
      {...defaultProps}
      onMoveToGroup={onMoveToGroup}

    />);
    fireEvent.click(screen.getByText('Select a group'));
    fireEvent.click(screen.getByText('Group 1'));
    fireEvent.click(screen.getByText('Move'));
    await waitFor(() => {
      expect(onMoveToGroup).toHaveBeenCalledWith(mockProcess, 'Group 1', undefined);
    });
  });

  it('calls onMoveToUngrouped when "Exclude from Group" is selected and move button is clicked', async () => {
    const onMoveToUngrouped = vi.fn();
    portalRender(<MoveProcessModal {...defaultProps} onMoveToUngrouped={onMoveToUngrouped} moveToUngroupedEnable />);
    fireEvent.click(screen.getByText('Select a group'));
    fireEvent.click(screen.getByText('Exclude from Group'));
    fireEvent.click(screen.getByText('Move'));
    await waitFor(() => {
      expect(onMoveToUngrouped).toHaveBeenCalledWith(mockProcess, undefined);
    });
  });

  it('calls onOpenChange with false when the cancel button is clicked', () => {
    const onOpenChange = vi.fn();
    portalRender(<MoveProcessModal {...defaultProps} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByText('modals.groupName.cancelButton'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
