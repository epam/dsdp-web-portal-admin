import React from 'react';
import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { fireEvent, portalRender, waitFor } from '#shared/utils/testUtils';
import { getCommonReduxMockState } from 'utils/testUtils';
import { useDropzone } from 'react-dropzone';
import { X_PATH } from 'constants/xPath';
import {
  getImportInfoRequest,
  startImportRequest,
  deleteImportFileRequest,
  sendImportFileClean,
} from 'store/users';
import useVersion from 'hooks/useVersion';

import ImportForm from '../ImportForm';

vi.mock('react-dropzone', () => ({
  useDropzone: vi.fn(),
}));

vi.mock('hooks/useVersion', () => ({
  default: vi.fn(),
}));

const useDropzoneMock = vi.mocked(useDropzone);
const useVersionMock = vi.mocked(useVersion);

const mockState = getCommonReduxMockState({
  users: { fileInfo: null },
});

const mockStateWithFile = getCommonReduxMockState({
  users: {
    fileInfo: {
      id: 'file-id-1',
      name: 'users.csv',
      size: 1024,
    },
  },
});

describe('ImportForm', () => {
  let capturedOnDrop: ((files: any[]) => void) | null = null;

  beforeEach(() => {
    capturedOnDrop = null;
    useVersionMock.mockReturnValue({ versionId: 'test-version-id' } as any);
    useDropzoneMock.mockImplementation(({ onDrop }: any) => {
      capturedOnDrop = onDrop;
      return {
        getRootProps: () => ({}),
        getInputProps: () => ({}),
      } as any;
    });
  });

  describe('initial render', () => {
    it('should dispatch getImportInfoRequest on mount', () => {
      const dispatchMock = vi.fn();
      portalRender(<ImportForm />, { preloadedState: mockState, dispatchMock });
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: getImportInfoRequest.type }),
      );
    });

    it('should render dropzone when no file is uploaded', () => {
      const wrapper = portalRender(<ImportForm />, { preloadedState: mockState });
      expect(wrapper.container.querySelector('input')).toBeInTheDocument();
    });
  });

  describe('start import', () => {
    it('should dispatch startImportRequest when start button is clicked', () => {
      const dispatchMock = vi.fn();
      const wrapper = portalRender(<ImportForm />, { preloadedState: mockState, dispatchMock });
      const startButton = wrapper.getByTestId(X_PATH.startImportButton);
      fireEvent.click(startButton);
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: startImportRequest.type }),
      );
    });
  });

  describe('file removal', () => {
    it('should dispatch deleteImportFileRequest when close button is clicked', () => {
      const dispatchMock = vi.fn();
      const wrapper = portalRender(<ImportForm />, { preloadedState: mockStateWithFile, dispatchMock });
      const closeButton = wrapper.container.querySelector('button');
      if (closeButton) {
        fireEvent.click(closeButton);
      }
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({ type: deleteImportFileRequest.type }),
      );
    });
  });

  describe('onDrop callback', () => {
    it('should dispatch sendImportFileClean on any file drop', async () => {
      const dispatchMock = vi.fn();
      portalRender(<ImportForm />, { preloadedState: mockState, dispatchMock });
      capturedOnDrop?.([new File([''], 'test.csv', { type: 'text/csv' })]);
      await waitFor(() => {
        expect(dispatchMock).toHaveBeenCalledWith(
          expect.objectContaining({ type: sendImportFileClean.type }),
        );
      });
    });

    it('should show error when file exceeds 30 MB size limit', async () => {
      const dispatchMock = vi.fn();
      const wrapper = portalRender(<ImportForm />, { preloadedState: mockState, dispatchMock });
      // 100 MB file
      capturedOnDrop?.([{ size: 104857600, name: 'huge.csv', type: 'text/csv' }]);
      await waitFor(() => {
        expect(wrapper.getByText('text.tooBigFileSize')).toBeInTheDocument();
      });
    });

    it('should show error when file type is not text/csv', async () => {
      const dispatchMock = vi.fn();
      const wrapper = portalRender(<ImportForm />, { preloadedState: mockState, dispatchMock });
      capturedOnDrop?.([{ size: 100, name: 'file.txt', type: 'text/plain' }]);
      await waitFor(() => {
        expect(wrapper.getByText('text.invalidFileType')).toBeInTheDocument();
      });
    });
  });
});
