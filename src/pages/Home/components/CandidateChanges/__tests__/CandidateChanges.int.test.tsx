import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { getCommonReduxMockState } from 'utils/testUtils';
import {
  portalRender,
} from '#shared/utils/testUtils';

import CandidateChanges from '../CandidateChanges';

const createState = (state?: object) => {
  return getCommonReduxMockState({
    form: {
      form: {},
      ...state,
    },
  });
};

describe('CandidateChanges', () => {
  describe('initial render', () => {
    it('should render revert action', () => {
      const dispatchMock = vi.fn();
      const data = [{
        name: 'name',
        title: 'title',
        status: 'status',
      }];

      const wrapper = portalRender(<CandidateChanges title="test" data={data} onRevert={() => {}} />, {
        preloadedState: createState(),
        dispatchMock,
      });

      expect(wrapper.queryByTitle('table.columns.revert.buttonTitle')).toBeInTheDocument();
    });

    it('should show native language name for changedI18nFiles', () => {
      const dispatchMock = vi.fn();
      const data = [{
        name: 'en',
        title: null as unknown as string,
        status: 'status',
      }, {
        name: 'uk',
        title: null as unknown as string,
        status: 'status',
      }];

      const wrapper = portalRender((<CandidateChanges title="changedI18nFiles" data={data} onRevert={() => {}} />), {
        dispatchMock,
      });

      expect(wrapper.queryByText('EN - English')).toBeInTheDocument();
      expect(wrapper.queryByText('UK - Українська')).toBeInTheDocument();
    });
  });
});
