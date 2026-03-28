import React from 'react';
import {
  describe, it, expect, vi,
} from 'vitest';
import { portalRender, screen } from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';
import { getReportListRequest, getReportListClean } from 'store/report';

import ReportListPage from '../ReportListPage';

const mockState = getCommonReduxMockState({
  report: {
    list: [
      {
        id: '1',
        name: 'Report Alpha',
        slug: 'alpha',
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-02T00:00:00',
      },
      {
        id: '2',
        name: 'Report Beta',
        slug: 'beta-slug',
        createdAt: '2024-01-01T00:00:00',
        updatedAt: '2024-01-02T00:00:00',
      },
    ],
  },
});

const emptyState = getCommonReduxMockState({
  report: { list: [] },
});

describe('ReportListPage', () => {
  describe('initial render', () => {
    it('should dispatch getReportListRequest on mount', () => {
      const dispatchMock = vi.fn();
      portalRender(<ReportListPage />, { preloadedState: mockState, dispatchMock });
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getReportListRequest.type }),
      );
    });

    it('should render report names from the store', () => {
      portalRender(<ReportListPage />, { preloadedState: mockState });
      expect(screen.getByText('Report Alpha')).toBeInTheDocument();
      expect(screen.getByText('Report Beta')).toBeInTheDocument();
    });

    it('should render with empty report list', () => {
      const dispatchMock = vi.fn();
      portalRender(<ReportListPage />, { preloadedState: emptyState, dispatchMock });
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getReportListRequest.type }),
      );
    });
  });

  describe('cleanup', () => {
    it('should dispatch getReportListClean on unmount', () => {
      const dispatchMock = vi.fn();
      const { unmount } = portalRender(<ReportListPage />, { preloadedState: mockState, dispatchMock });
      unmount();
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getReportListClean.type }),
      );
    });
  });
});
