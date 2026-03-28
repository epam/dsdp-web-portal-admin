import {
  vi, describe, it, expect, afterEach,
} from 'vitest';
import React from 'react';
import { RenderResult } from '@testing-library/react';

import {
  deleteI18nRequest, getI18nListRequest, I18nState, updateI18nRequest,
} from 'store/i18n';
import { getCommonReduxMockState } from 'utils/testUtils';
import { fireEvent, portalRender, waitFor } from '#shared/utils/testUtils';

import I18nListPage from '../I18nListPage';

const createState = (expectedI18n: I18nState) => {
  return getCommonReduxMockState({
    i18n: expectedI18n,
  });
};

const updateI18n = async (wrapper: RenderResult) => {
  const editIcon = wrapper.getByTestId('i18nEditButton');
  fireEvent.click(editIcon);
  await waitFor(
    () => expect(wrapper.getAllByText('title.edit').length).toBe(1),
  );

  const updateButton = wrapper.getByText('actions.save');
  fireEvent.click(updateButton);
  expect(wrapper.getByText('text.title')).toBeInTheDocument();
};

const deleteI18n = async (wrapper: RenderResult) => {
  const deleteIcon = wrapper.getByTestId('i18nDeleteButton');
  fireEvent.click(deleteIcon);
  await waitFor(
    () => expect(wrapper.getAllByText('title').length).toBe(2),
  );

  const deleteButton = wrapper.getByText('actions.delete');
  fireEvent.click(deleteButton);
  expect(wrapper.getByText('text.title')).toBeInTheDocument();
};

describe('I18nListPage', () => {
  describe('initial render', () => {
    const { supportedLanguages } = ENVIRONMENT_VARIABLES;
    it.skip('should show empty placeholder if no languages defined', () => {
      ENVIRONMENT_VARIABLES.supportedLanguages = [];
      const dispatchMock = vi.fn();

      const wrapper = portalRender(<I18nListPage />, {
        preloadedState: createState({
          list: [],
          i18nContent: null,
          hasConflicts: null,
          eTags: null,
        }),
        dispatchMock,
      });

      expect(wrapper.baseElement.querySelector('tbody')?.childNodes.length).toBe(0);
      expect(wrapper.findByText('i18nList.table.emptyPlaceholder')).toBeTruthy();
      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({ type: getI18nListRequest.type }));
    });

    it('should show edit and delete icons only for languages that have bundle', async () => {
      const dispatchMock = vi.fn();
      ENVIRONMENT_VARIABLES.supportedLanguages = ['en', 'fr'];
      const wrapper = portalRender(<I18nListPage />, {
        preloadedState: createState({
          list: [{ name: 'en' }],
          i18nContent: null,
          hasConflicts: null,
          eTags: null,
        }),
        dispatchMock,
      });

      expect(wrapper.baseElement.querySelector('tbody')?.childNodes.length).toBe(2);
      expect(wrapper.queryAllByTestId('i18nEditButton').length).toBe(1);
      expect(wrapper.queryAllByTestId('i18nDeleteButton').length).toBe(1);
      expect(wrapper.queryByText('i18nList.table.emptyPlaceholder')).not.toBeInTheDocument();
    });

    it('should delete i18n in master', async () => {
      const dispatchMock = vi.fn();
      ENVIRONMENT_VARIABLES.supportedLanguages = ['en', 'fr'];
      const wrapper = portalRender(<I18nListPage />, {
        preloadedState: createState({
          list: [{ name: 'en' }],
          i18nContent: null,
          hasConflicts: null,
          eTags: null,
        }),
        dispatchMock,
      });

      await deleteI18n(wrapper);

      const continueInMasterVersionButton = wrapper.getByText('actions.continueMasterVersion');
      fireEvent.click(continueInMasterVersionButton);
      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: deleteI18nRequest.type,
        payload: {
          name: 'en',
          versionId: 'master',
        },
      }));
    });

    it('should update i18n in master', async () => {
      const dispatchMock = vi.fn();
      ENVIRONMENT_VARIABLES.supportedLanguages = ['en', 'fr'];
      const wrapper = portalRender(<I18nListPage />, {
        preloadedState: createState({
          list: [{ name: 'en' }],
          i18nContent: null,
          hasConflicts: null,
          eTags: null,
        }),
        dispatchMock,
      });

      await updateI18n(wrapper);

      const continueInMasterVersionButton = wrapper.getByText('actions.continueMasterVersion');
      fireEvent.click(continueInMasterVersionButton);
      expect(dispatchMock).toHaveBeenCalledWith(expect.objectContaining({
        type: updateI18nRequest.type,
        payload: {
          name: 'en',
          i18nContent: '',
          versionId: 'master',
        },
      }));
    });

    it('should create version-candidate and delete i18n there', async () => {
      const dispatchMock = vi.fn();
      ENVIRONMENT_VARIABLES.supportedLanguages = ['en'];
      const wrapper = portalRender(<I18nListPage />, {
        preloadedState: createState({
          list: [{ name: 'en' }],
          i18nContent: null,
          hasConflicts: null,
          eTags: null,
        }),
        dispatchMock,
      });

      await deleteI18n(wrapper);

      const createCandidateVersionButton = wrapper.getByText('actions.createCandidateVersion');
      fireEvent.click(createCandidateVersionButton);
      expect(wrapper.getByText('text.createNewRequest')).toBeInTheDocument();
    });

    it('should create version-candidate and update i18n there', async () => {
      const dispatchMock = vi.fn();
      ENVIRONMENT_VARIABLES.supportedLanguages = ['en'];
      const wrapper = portalRender(<I18nListPage />, {
        preloadedState: createState({
          list: [{ name: 'en' }],
          i18nContent: null,
          hasConflicts: null,
          eTags: null,
        }),
        dispatchMock,
      });

      await updateI18n(wrapper);

      const createCandidateVersionButton = wrapper.getByText('actions.createCandidateVersion');
      fireEvent.click(createCandidateVersionButton);
      expect(wrapper.getByText('text.createNewRequest')).toBeInTheDocument();
    });

    afterEach(() => {
      ENVIRONMENT_VARIABLES.supportedLanguages = supportedLanguages;
    });
  });
});
