import React from 'react';
import { getCommonReduxMockState } from 'utils/testUtils';
import { portalRender as render } from '#shared/utils/testUtils';
import { describe, expect, it } from 'vitest';
import StandardLayout from '../StandardLayout';

const mockState = getCommonReduxMockState({
  asyncAction: {
    asyncActionMap: {},
  },
});

describe('StandardLayout', () => {
  describe('initial render', () => {
    it('should fill loader', async () => {
      const wrapper = render(<StandardLayout title="" isLoading />, { preloadedState: mockState as any });
      expect(wrapper.getByTestId('component-loader')).toBeInTheDocument();
    });
  });
});
