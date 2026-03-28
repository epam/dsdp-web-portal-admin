import React from 'react';
import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { getCommonReduxMockState } from 'utils/testUtils';
import { portalRender } from '#shared/utils/testUtils';
import TableListPage from '../TableListPage';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

const mockState = getCommonReduxMockState({
  tables: {},
});

describe('TableListPage', () => {
  it('should be defined', () => {
    const wrapper = portalRender(<TableListPage />, { preloadedState: mockState });
    expect(wrapper).toBeDefined();
    expect(wrapper.getByText('title')).toBeInTheDocument();
    expect(wrapper.getByText('text.tableList')).toBeInTheDocument();
  });
});
