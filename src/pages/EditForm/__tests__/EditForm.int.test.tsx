import {
  describe, expect, it, vi,
} from 'vitest';
import React from 'react';

import { getCommonReduxMockState } from 'utils/testUtils';
import { getFormByNameRequest, updateFormError, updateFormRequest } from 'store/form';
import { ENTITY_MODE_TAB_QUERY_PARAM } from 'constants/common';
import {
  portalRender,
  fireEvent,
  act,
  screen,
} from '#shared/utils/testUtils';
import EditFormPage from '../EditFormPage';

const preloadedState = getCommonReduxMockState({
  form: {
    form: {
      title: '1234',
      path: '1234',
      components: [],
    },
  },
});

describe('EditForm page', () => {
  describe('initial render', () => {
    it('should get initial data', () => {
      const dispatchMock = vi.fn();
      portalRender(<EditFormPage />, { dispatchMock, preloadedState });
      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: getFormByNameRequest.type,
      }));
    });
  });

  describe.skip('submit', () => {
    it('should dispatch update action on valid data', async () => {
      const dispatchMock = vi.fn();
      await act(async () => {
        portalRender(<EditFormPage />, { dispatchMock, preloadedState });
      });
      const submitButton = screen.getByRole('button', { name: 'header.createButton' });

      await act(async () => {
        fireEvent.click(submitButton);
      });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: updateFormRequest.type,
      }));
    });

    it('should dispatch error action if jsonScheme has invalid value', async () => {
      const dispatchMock = vi.fn();
      await act(async () => {
        portalRender(
          <EditFormPage />,
          {
            dispatchMock,
            preloadedState,
            locationSettings: { search: `${ENTITY_MODE_TAB_QUERY_PARAM}=code` },
          },
        );
      });
      const submitButton = screen.getByRole('button', { name: 'header.createButton' });
      const jsonSchemeInput = screen.getByRole('textbox');

      await act(async () => {
        fireEvent.change(jsonSchemeInput, { target: { value: '{ "title": "1234"' } });
        fireEvent.click(submitButton);
      });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: updateFormError.type,
      }));
    });
  });
});
