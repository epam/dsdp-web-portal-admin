import {
  describe, expect, it, vi,
} from 'vitest';
import React from 'react';
import get from 'lodash/get';

import {
  createFormError, createFormRequest, getFormByNameRequest,
} from 'store/form';
import { getCommonReduxMockState } from 'utils/testUtils';
import { ENTITY_MODE_TAB_QUERY_PARAM } from 'constants/common';
import {
  act,
  fireEvent,
  portalRender,
  screen,
} from '#shared/utils/testUtils';

import CreateFormPage from '../CreateFormPage';

const createState = (state?: object) => {
  return getCommonReduxMockState({
    form: {
      form: {},
      ...state,
    },
  });
};

describe('CreateFormPage', () => {
  describe('initial render', () => {
    it('should get request components if only name present', () => {
      const dispatchMock = vi.fn();
      const initialData = { name: 'test' };

      const wrapper = portalRender(<CreateFormPage />, {
        preloadedState: createState(),
        dispatchMock,
        locationSettings: { state: initialData },
      });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: getFormByNameRequest.type }));
      expect(wrapper.queryByText('components.modal.nonConflicts.description')).not.toBeInTheDocument();
    });
    it('should show modal component', async () => {
      const dispatchMock = vi.fn();
      const initialData = { name: 'test', hasConflicts: false };
      const wrapper = portalRender(<CreateFormPage />, {
        preloadedState: createState({ hasConflicts: false }),
        dispatchMock,
        locationSettings: { state: initialData },
      });
      expect(wrapper.getByText('text.description')).toBeInTheDocument();
    });
  });

  describe.skip('submit', () => {
    it('should dispatch create action on valid data', async () => {
      const dispatchMock = vi.fn();
      await act(async () => {
        portalRender(<CreateFormPage />, {
          dispatchMock,
          preloadedState: createState(),
        });
      });
      const submitButton = screen.getByRole('button', { name: 'header.createButton' });
      const inputs = screen.getAllByRole('textbox');
      const pathInput = inputs.find((input) => get(input, 'name', '') === 'path');
      const titleInput = inputs.find((input) => get(input, 'name', '') === 'title');

      await act(async () => {
        if (pathInput) {
          fireEvent.change(pathInput, { target: { value: 'path' } });
        }
        if (titleInput) {
          fireEvent.change(titleInput, { target: { value: 'title' } });
        }
        fireEvent.click(submitButton);
      });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: createFormRequest.type,
      }));
    });

    it('should dispatch error action if jsonScheme has invalid value', async () => {
      const dispatchMock = vi.fn();
      await act(async () => {
        render(
          <CreateFormPage />,
          {
            dispatchMock,
            preloadedState: createState(),
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
        type: createFormError.type,
      }));
    });
  });
});
