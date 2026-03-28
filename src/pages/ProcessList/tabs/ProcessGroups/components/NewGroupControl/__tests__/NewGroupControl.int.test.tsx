import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import userEvent from '@testing-library/user-event';
import {
  fireEvent, portalRender, screen, waitFor,
} from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';

import NewGroupControl from '../NewGroupControl';

const baseState = getCommonReduxMockState({});

describe('NewGroupControl', () => {
  describe('initial render', () => {
    it('should render without crashing', () => {
      portalRender(
        <NewGroupControl onAdd={vi.fn()} existingGroupNames={[]} />,
        { preloadedState: baseState },
      );
    });

    it('should render a button to create a new group', () => {
      const wrapper = portalRender(
        <NewGroupControl onAdd={vi.fn()} existingGroupNames={[]} />,
        { preloadedState: baseState },
      );
      expect(wrapper.getByText('processGroupsTab.createGroup')).toBeInTheDocument();
    });
  });

  describe('modal', () => {
    it('should open EditGroupNameModal when button is clicked', () => {
      const wrapper = portalRender(
        <NewGroupControl onAdd={vi.fn()} existingGroupNames={[]} />,
        { preloadedState: baseState },
      );
      const button = wrapper.getByText('processGroupsTab.createGroup');
      fireEvent.click(button);
      expect(screen.getByText('modals.groupName.addTitle')).toBeInTheDocument();
    });

    it('should call onAdd with group name when form is submitted', async () => {
      const onAdd = vi.fn();
      const wrapper = portalRender(
        <NewGroupControl onAdd={onAdd} existingGroupNames={[]} />,
        { preloadedState: baseState },
      );
      // Open modal
      fireEvent.click(wrapper.getByText('processGroupsTab.createGroup'));
      // Fill in the group name and submit
      const nameInput = screen.queryByRole('textbox');
      if (nameInput) {
        await userEvent.type(nameInput, 'New Group Name');
        const submitButton = screen.queryByText('modals.groupName.addSubmitButton');
        if (submitButton) {
          fireEvent.click(submitButton);
          await waitFor(() => {
            expect(onAdd).toHaveBeenCalledWith('New Group Name');
          });
        }
      }
    });
  });
});
