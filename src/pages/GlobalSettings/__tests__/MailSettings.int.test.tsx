import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { getCommonReduxMockState } from 'utils/testUtils';
import {
  portalRender,
  act,
  screen,
} from '#shared/utils/testUtils';

import MailSettings from '../index';

const mockState = getCommonReduxMockState({
  settings: {
    settings: {
      title: 'title test',
      titleFull: 'titleFull',
      theme: 'theme',
      supportEmail: 'supportEmail',
      blacklistedDomains: [],
    },
  },
});

describe('MailSettings', () => {
  describe('initial render', () => {
    it('should fill inputs with data', async () => {
      const dispatchMock = vi.fn();

      await act(async () => {
        portalRender(<MailSettings />, {
          preloadedState: mockState,
          dispatchMock,
        });
      });

      expect(screen.getByPlaceholderText('name@email.com'))
        .toHaveValue('supportEmail');
    });
  });
});
