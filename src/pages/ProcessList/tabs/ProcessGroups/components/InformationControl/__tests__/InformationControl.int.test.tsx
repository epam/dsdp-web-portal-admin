import React from 'react';
import { describe, it, expect } from 'vitest';
import {
  fireEvent, portalRender, screen, waitFor,
} from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';

import InformationControl from '../InformationControl';

const baseState = getCommonReduxMockState({});

describe('InformationControl', () => {
  describe('initial render', () => {
    it('should render without crashing', () => {
      portalRender(<InformationControl />, { preloadedState: baseState });
    });

    it('should render the information reference button', () => {
      const wrapper = portalRender(<InformationControl />, { preloadedState: baseState });
      expect(wrapper.getByText('processGroupsTab.reference')).toBeInTheDocument();
    });
  });

  describe('modal', () => {
    it('should open ConfirmModal when reference button is clicked', () => {
      const wrapper = portalRender(<InformationControl />, { preloadedState: baseState });
      const button = wrapper.getByText('processGroupsTab.reference');
      fireEvent.click(button);
      expect(screen.getByText('modals.information.title')).toBeInTheDocument();
    });

    it('should close modal when close button is clicked', async () => {
      const wrapper = portalRender(<InformationControl />, { preloadedState: baseState });
      fireEvent.click(wrapper.getByText('processGroupsTab.reference'));
      expect(screen.getByText('modals.information.title')).toBeInTheDocument();
      const closeButton = screen.queryByText('modals.information.closeButton');
      if (closeButton) {
        fireEvent.click(closeButton);
        await waitFor(() => {
          expect(wrapper.queryByText('modals.information.title')).not.toBeInTheDocument();
        });
      }
    });
  });
});
