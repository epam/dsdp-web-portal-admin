/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { getProcessListRequest } from 'store/process';
import { getCommonReduxMockState } from 'utils/testUtils';
import {
  waitFor,
  fireEvent,
  portalRender,
  screen,
} from '#shared/utils/testUtils';
import ProcessListTab from '../ProcessListTab';

vi.mock('store/process', async (importOriginal) => {
  const original: typeof import('store/process') = await importOriginal();
  return {
    ...original,
    getProcessListRequest: vi.fn(),
    deleteProcessRequest: vi.fn(),
  };
});

const createProcessState = (state?: object) => {
  return getCommonReduxMockState({
    process: {
      list: [],
      process: null,
      ...state,
    },
  });
};

describe('ProcessListTab', () => {
  const dispatchMock = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ProcessListTab and search bar', async () => {
    portalRender(<ProcessListTab />, { preloadedState: createProcessState(), dispatchMock });

    expect(getProcessListRequest).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getAllByText(/search/i)[0]).toBeInTheDocument();
    });
  });

  it('search input filters process list', async () => {
    const store = createProcessState({
      list: [
        { name: 'process1', title: 'Process 1' },
        { name: 'process2', title: 'Process 2' },
      ],
    });

    portalRender(<ProcessListTab />, { preloadedState: store, dispatchMock });

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Process 1' } });

    await waitFor(() => {
      expect(screen.getByText('Process 1')).toBeInTheDocument();
      expect(screen.queryByText('Process 2')).not.toBeInTheDocument();
    });
  });

  it('handles create process click', async () => {
    portalRender(<ProcessListTab />, { preloadedState: createProcessState(), dispatchMock });

    const createButton = screen.getByText(/table.createProcess/i);
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(/components~modal.whereToSaveChanges.text.descriptionCreateProcess/i))
        .toBeInTheDocument();
    });
  });
});
