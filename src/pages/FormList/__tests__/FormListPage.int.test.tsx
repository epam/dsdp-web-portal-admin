import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { getFormListRequest } from 'store/form';
import { getCommonReduxMockState } from 'utils/testUtils';
import {
  fireEvent,
  portalRender,
  waitFor,
} from '#shared/utils/testUtils';

import FormListPage from '../FormListPage';

vi.mock('api', () => {
  return {
    localesApi: {
      get$: (() => ({
        toPromise: () => Promise.resolve({ response: {} }),
      })),
    },
  };
});

const createState = () => {
  return getCommonReduxMockState({
    form: {
      form: {},
    },
  });
};

describe('FormListPage', () => {
  describe('initial render', () => {
    it('should get initial data', () => {
      const dispatchMock = vi.fn();

      portalRender(<FormListPage />, {
        preloadedState: createState(),
        dispatchMock,
      });

      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: getFormListRequest.type }));
    });
    it('should show modal ModalWhereToSaveChanges', async () => {
      const dispatchMock = vi.fn();

      const wrapper = portalRender(<FormListPage />, {
        preloadedState: createState(),
        dispatchMock,
      });
      const createFormButton = wrapper.getByText('table.createForm');
      fireEvent.click(createFormButton);
      expect(wrapper.getByText('text.title')).toBeInTheDocument();

      // close modal ModalWhereToSaveChanges
      fireEvent.click(wrapper.getByText('actions.cancel'));
      await waitFor(
        () => expect(wrapper.queryByText('text.title')).not.toBeInTheDocument(),
      );

      // open modal ModalCreateVersion
      fireEvent.click(createFormButton);
      expect(wrapper.getByText('text.title')).toBeInTheDocument();
      fireEvent.click(wrapper.getByText('actions.createCandidateVersion'));
      expect(
        wrapper.getByText('actions.createCandidateVersion'),
      ).toBeInTheDocument();
    });
  });
});
