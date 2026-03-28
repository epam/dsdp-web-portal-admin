import React from 'react';
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { screen, portalRender } from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';
import { getTableByNameRequest, getTableByNameClean } from 'store/tables';
import useEntityMode from 'hooks/useEntityMode';

import EditTablePage from '../EditTablePage';

vi.mock('hooks/useEntityMode', () => ({
  default: vi.fn(),
}));

vi.mock('components/Layouts/TableLayout', () => ({
  default: ({ children }: any) => <div data-xpath="table-layout">{children}</div>,
}));

vi.mock('components/TableManagement/TableColumns', () => ({
  default: () => <div data-xpath="table-columns" />,
}));

vi.mock('components/TableManagement/TableIndexes', () => ({
  default: () => <div data-xpath="table-indexes" />,
}));

vi.mock('../../../components/TableManagement/TableFields/TableFields', () => ({
  default: () => <div data-xpath="table-fields" />,
}));

const useEntityModeMock = vi.mocked(useEntityMode);

const mockState = getCommonReduxMockState({
  tables: {
    list: [],
    table: null,
    dataModel: '',
  },
});

describe('EditTablePage', () => {
  beforeEach(() => {
    useEntityModeMock.mockReturnValue('common' as any);
  });

  describe('initial render', () => {
    it('should dispatch getTableByNameRequest on mount', () => {
      const dispatchMock = vi.fn();
      portalRender(<EditTablePage />, { preloadedState: mockState, dispatchMock });
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getTableByNameRequest.type }),
      );
    });
  });

  describe('cleanup', () => {
    it('should dispatch getTableByNameClean on unmount', () => {
      const dispatchMock = vi.fn();
      const { unmount } = portalRender(<EditTablePage />, { preloadedState: mockState, dispatchMock });
      unmount();
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getTableByNameClean.type }),
      );
    });
  });

  describe('tab modes', () => {
    it('should render TableFields when mode is common', () => {
      useEntityModeMock.mockReturnValue('common' as any);
      portalRender(<EditTablePage />, { preloadedState: mockState });
      expect(screen.getByTestId('table-fields')).toBeInTheDocument();
    });

    it('should render TableColumns when mode is columns', () => {
      useEntityModeMock.mockReturnValue('columns' as any);
      portalRender(<EditTablePage />, { preloadedState: mockState });
      expect(screen.getByTestId('table-columns')).toBeInTheDocument();
    });

    it('should render TableIndexes when mode is indexes', () => {
      useEntityModeMock.mockReturnValue('indexes' as any);
      portalRender(<EditTablePage />, { preloadedState: mockState });
      expect(screen.getByTestId('table-indexes')).toBeInTheDocument();
    });
  });
});
