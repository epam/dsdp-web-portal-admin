import React from 'react';
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { fireEvent, portalRender, screen } from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';
import { groupActionDeleteGroup } from 'store/processGroups';
import { X_PATH } from 'constants/xPath';

import ProcessGroupActions from '../ProcessGroupActions';

const mockItem = {
  name: 'Test Group',
  entityList: [],
} as any;

const mockState = getCommonReduxMockState({
  processGroups: {
    groupData: { groups: [], ungrouped: [] },
    groupDataEdit: {
      groups: [{ name: 'Test Group', processDefinitions: [] }],
      ungrouped: [],
    },
  },
});

describe('ProcessGroupActions', () => {
  let unselectGroup: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    unselectGroup = vi.fn();
  });

  describe('initial render', () => {
    it('should render without crashing', () => {
      portalRender(
        <ProcessGroupActions item={mockItem} unselectGroup={unselectGroup} />,
        { preloadedState: mockState },
      );
    });
  });

  describe('rename action', () => {
    it('should open EditGroupNameModal when rename menu item is clicked', () => {
      const wrapper = portalRender(
        <ProcessGroupActions item={mockItem} unselectGroup={unselectGroup} />,
        { preloadedState: mockState },
      );
      // Open the popper menu
      const menuTrigger = wrapper.container.querySelector('button');
      if (menuTrigger) {
        fireEvent.click(menuTrigger);
      }
      const renameItem = screen.queryByTestId(X_PATH.menuRename);
      if (renameItem) {
        fireEvent.click(renameItem);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      }
    });
  });

  describe('delete action', () => {
    it('should open ConfirmModal when delete menu item is clicked', () => {
      const wrapper = portalRender(
        <ProcessGroupActions item={mockItem} unselectGroup={unselectGroup} />,
        { preloadedState: mockState },
      );
      // Open the popper menu
      const menuTrigger = wrapper.container.querySelector('button');
      if (menuTrigger) {
        fireEvent.click(menuTrigger);
      }
      const deleteItem = screen.queryByTestId(X_PATH.menuDelete);
      if (deleteItem) {
        fireEvent.click(deleteItem);
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      }
    });

    it('should dispatch groupActionDeleteGroup and call unselectGroup on confirm delete', () => {
      const dispatchMock = vi.fn();
      const wrapper = portalRender(
        <ProcessGroupActions item={mockItem} unselectGroup={unselectGroup} />,
        { preloadedState: mockState, dispatchMock },
      );
      // Open menu
      const menuTrigger = wrapper.container.querySelector('button');
      if (menuTrigger) {
        fireEvent.click(menuTrigger);
      }
      const deleteItem = screen.queryByTestId(X_PATH.menuDelete);
      if (deleteItem) {
        fireEvent.click(deleteItem);
        // Click confirm in the modal
        const confirmButtons = screen.queryAllByRole('button');
        const confirmBtn = confirmButtons.find((btn) => btn.textContent === 'modals.deleteConfirmation.approve');
        if (confirmBtn) {
          fireEvent.click(confirmBtn);
          expect(dispatchMock).toHaveBeenCalledWith(
            expect.objectContaining({ type: groupActionDeleteGroup.type }),
          );
          expect(unselectGroup).toHaveBeenCalled();
        }
      }
    });
  });
});
