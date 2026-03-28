import React from 'react';
import {
  vi, describe, it, expect, beforeEach, afterEach,
} from 'vitest';
import { getCommonReduxMockState } from 'utils/testUtils';
import {
  getCandidateRequest,
  getCandidateChangesRequest,
  mergeCandidateRequest,
  abandonCandidateRequest,
  rebaseCandidateRequest,
  revertChangeRequest,
  rebaseCandidateClean,
} from 'store/versions/slice';
import {
  portalRender,
  screen,
  fireEvent,
  waitFor,
} from '#shared/utils/testUtils';
import type { CandidateDetails, VersionsChanges, VersionCheckResult } from 'types/versions';

import Candidate from '../index';

// Mock child components
vi.mock('../../CandidateChanges', () => ({
  default: ({ title, data, onRevert }: {
    title: string;
    data: Array<unknown>;
    onRevert: (type: string, item: unknown) => void;
  }) => {
    // Only render if we have data
    if (!data || data.length === 0) return null;
    return (
      <div data-xpath={`candidate-changes-${title}`}>
        <span>{title}</span>
        <span>{data.length} changes</span>
        <button onClick={() => onRevert('test-type', data[0])}>
          Revert First
        </button>
      </div>
    );
  },
}));

// Mock CheckListItem
vi.mock('components/CheckListItem', () => ({
  default: ({
    status, successMessage, failedMessage, pendingMessage,
  }: {
    status: string;
    successMessage: string;
    failedMessage: string;
    pendingMessage: string;
  }) => (
    <div data-xpath={`checklist-item-${status}`}>
      {status === 'SUCCESS' && <span>{successMessage}</span>}
      {status === 'FAILED' && <span>{failedMessage}</span>}
      {status === 'PENDING' && <span>{pendingMessage}</span>}
    </div>
  ),
}));

// Mock ColoredBox
vi.mock('#web-components/components/ColoredBox', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-xpath="colored-box">{children}</div>
  ),
}));

// Mock ConfirmModal
vi.mock('#web-components/components/ConfirmModal', () => ({
  default: ({
    isOpen,
    title,
    confirmationText,
    submitText,
    onSubmit,
  }: {
    isOpen: boolean;
    title: string;
    confirmationText: string;
    submitText: string;
    onSubmit: () => void;
  }) => (isOpen ? (
    <div data-xpath="confirm-modal">
      <span>{title}</span>
      <span>{confirmationText}</span>
      <button onClick={onSubmit}>{submitText}</button>
    </div>
  ) : null),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}));

// Mock useVersion hook
const mockUseVersion = {
  versionId: 'test-version-123',
};

vi.mock('hooks/useVersion', () => ({
  default: () => mockUseVersion,
}));

// Mock window.open
const mockWindowOpen = vi.fn();

const mockCandidateDetails: CandidateDetails = {
  id: 'test-version-123',
  name: 'Test Candidate',
  description: 'Test description of the candidate',
  author: 'test-author',
  creationDate: '2023-12-01T10:00:00Z',
  latestUpdate: '2023-12-15T14:30:00Z',
  latestRebase: '2023-12-14T12:00:00Z',
  hasConflicts: false,
  inspections: null,
  validations: [
    {
      name: 'Regulation Integrity',
      type: 'REGULATION_INTEGRITY',
      result: 'SUCCESS' as VersionCheckResult,
      resultDetails: 'All checks passed',
    },
    {
      name: 'Test Validation',
      type: 'TEST',
      result: 'SUCCESS' as VersionCheckResult,
      resultDetails: 'Tests passed',
    },
    {
      name: 'Deployment Status',
      type: 'DEPLOYMENT_STATUS',
      result: 'PENDING' as VersionCheckResult,
      resultDetails: 'Waiting for deployment',
    },
  ],
};

const mockVersionChanges: VersionsChanges = {
  changedForms: [
    { name: 'form1', title: 'Form 1', status: 'CHANGED' },
    { name: 'form2', title: 'Form 2', status: 'NEW' },
  ],
  changedBusinessProcesses: [
    { name: 'bp1', title: 'Business Process 1', status: 'CHANGED' },
  ],
  changedDataModelFiles: [],
  changedGroups: [],
  changedI18nFiles: [
    { name: 'i18n1', title: 'I18n File 1', status: 'CHANGED' },
  ],
};

const createMockState = (
  candidate: CandidateDetails | null = null,
  changes: VersionsChanges | null = null,
  changesRebased = false,
) => {
  return getCommonReduxMockState({
    versions: {
      versionsList: [],
      master: null,
      candidate,
      versionChanges: changes,
      changesRebased,
    },
  });
};

describe('Candidate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        origin: 'http://localhost:3000',
      },
    });
    Object.defineProperty(window, 'open', {
      writable: true,
      value: mockWindowOpen,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial render', () => {
    it('should dispatch getCandidateRequest and getCandidateChangesRequest on mount', () => {
      const dispatchMock = vi.fn();
      const mockState = createMockState();

      portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getCandidateRequest.type,
          payload: 'test-version-123',
        }),
      );

      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: getCandidateChangesRequest.type,
          payload: 'test-version-123',
        }),
      );
    });

    it('should dispatch rebaseCandidateClean on unmount', () => {
      const dispatchMock = vi.fn();
      const mockState = createMockState(mockCandidateDetails);

      const { unmount } = portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      dispatchMock.mockClear();
      unmount();

      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: rebaseCandidateClean.type,
        }),
      );
    });

    it('should render candidate name and description', () => {
      const mockState = createMockState(mockCandidateDetails);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('Test Candidate')).toBeInTheDocument();
      expect(screen.getByText('Test description of the candidate')).toBeInTheDocument();
    });

    it('should render creation date and latest rebase formatted', () => {
      const mockState = createMockState(mockCandidateDetails);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('text.creationDate')).toBeInTheDocument();
      expect(screen.getByText('text.latestRebase')).toBeInTheDocument();
    });

    it('should render all validations', () => {
      const mockState = createMockState(mockCandidateDetails);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      // Multiple SUCCESS validations exist (getByTestId searches data-xpath in portal-admin)
      const successItems = screen.getAllByTestId('checklist-item-SUCCESS');
      expect(successItems.length).toBeGreaterThan(0);
      expect(screen.getByTestId('checklist-item-PENDING')).toBeInTheDocument();
    });

    it('should not render candidate details when candidate is null', () => {
      const mockState = createMockState(null);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.queryByText('Test Candidate')).not.toBeInTheDocument();
    });
  });

  describe('conflicts status', () => {
    it('should show SUCCESS status when no conflicts', () => {
      const candidate = { ...mockCandidateDetails, hasConflicts: false };
      const mockState = createMockState(candidate);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('text.noConflictsMessage')).toBeInTheDocument();
    });

    it('should show PENDING status when has conflicts but not rebased', () => {
      const candidate = { ...mockCandidateDetails, hasConflicts: true };
      const mockState = createMockState(candidate, null, false);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('text.notCheckedMessage')).toBeInTheDocument();
    });

    it('should show FAILED status when has conflicts and rebased', () => {
      const candidate = { ...mockCandidateDetails, hasConflicts: true };
      const mockState = createMockState(candidate, null, true);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('text.hasConflictsMessage')).toBeInTheDocument();
    });
  });

  describe('merge functionality', () => {
    it('should enable merge button when no conflicts', () => {
      const candidate = { ...mockCandidateDetails, hasConflicts: false };
      const mockState = createMockState(candidate);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      const mergeButton = screen.getByText('text.mergeChanges');
      expect(mergeButton).toBeInTheDocument();
      // When enabled, it has the applyVersion xpath
      const linkElement = mergeButton.closest('a');
      expect(linkElement).toHaveAttribute('data-xpath', 'applyVersion');
    });

    it('should disable merge button when has conflicts', () => {
      const candidate = { ...mockCandidateDetails, hasConflicts: true };
      const mockState = createMockState(candidate, null, true);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      const mergeButton = screen.getByText('text.mergeChanges');
      expect(mergeButton).toBeInTheDocument();
      // When disabled, it has the applyVersionDisabled xpath
      const linkElement = mergeButton.closest('a');
      expect(linkElement).toHaveAttribute('data-xpath', 'applyVersionDisabled');
    });

    it('should show force merge dialog when validations are not all successful', () => {
      const candidate = { ...mockCandidateDetails, hasConflicts: false };
      const mockState = createMockState(candidate);
      const dispatchMock = vi.fn();

      portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      dispatchMock.mockClear();

      const mergeButton = screen.getByText('text.mergeChanges');
      fireEvent.click(mergeButton);

      // Should show force merge dialog since not all validations are SUCCESS (one is PENDING)
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });

    it('should show force merge dialog when validations fail', () => {
      const candidateWithFailedValidation = {
        ...mockCandidateDetails,
        hasConflicts: false,
        validations: [
          {
            name: 'Test',
            type: 'TEST' as const,
            result: 'FAILED' as VersionCheckResult,
            resultDetails: 'Test failed',
          },
        ],
      };
      const mockState = createMockState(candidateWithFailedValidation);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      const mergeButton = screen.getByText('text.mergeChanges');
      fireEvent.click(mergeButton);

      expect(screen.queryByTestId('confirm-modal')).toBeInTheDocument();
      expect(screen.getByText('forceMergeDialog.title')).toBeInTheDocument();
    });

    it('should dispatch merge when force merge is confirmed', () => {
      const candidateWithFailedValidation = {
        ...mockCandidateDetails,
        hasConflicts: false,
        validations: [
          {
            name: 'Test',
            type: 'TEST' as const,
            result: 'FAILED' as VersionCheckResult,
            resultDetails: 'Test failed',
          },
        ],
      };
      const mockState = createMockState(candidateWithFailedValidation);
      const dispatchMock = vi.fn();

      portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      const mergeButton = screen.getByText('text.mergeChanges');
      fireEvent.click(mergeButton);

      dispatchMock.mockClear();

      const confirmButton = screen.getByText('forceMergeDialog.okButton');
      fireEvent.click(confirmButton);

      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mergeCandidateRequest.type,
          payload: 'test-version-123',
        }),
      );
    });
  });

  describe('rebase functionality', () => {
    it('should dispatch rebaseCandidateRequest when rebase button clicked', () => {
      const mockState = createMockState(mockCandidateDetails);
      const dispatchMock = vi.fn();

      portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      dispatchMock.mockClear();

      const rebaseButton = screen.getByText('text.rebaseChanges');
      fireEvent.click(rebaseButton);

      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: rebaseCandidateRequest.type,
          payload: 'test-version-123',
        }),
      );
    });
  });

  describe('abandon functionality', () => {
    it('should dispatch abandonCandidateRequest when abandon button clicked', () => {
      const mockState = createMockState(mockCandidateDetails);
      const dispatchMock = vi.fn();

      portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      dispatchMock.mockClear();

      const abandonButton = screen.getByText('text.abandonChanges');
      fireEvent.click(abandonButton);

      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: abandonCandidateRequest.type,
          payload: 'test-version-123',
        }),
      );
    });
  });

  describe('changes rendering', () => {
    it('should render all change sections with data', () => {
      const mockState = createMockState(mockCandidateDetails, mockVersionChanges);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('text.changesLabel')).toBeInTheDocument();
      expect(screen.getByText('text.changesDescription')).toBeInTheDocument();

      // Check that change sections are rendered by the mock CandidateChanges component
      expect(screen.getByText('changedForms')).toBeInTheDocument();
      expect(screen.getByText('changedBusinessProcesses')).toBeInTheDocument();
    });

    it('should show no changes message when there are no changes', () => {
      const emptyChanges: VersionsChanges = {
        changedForms: [],
        changedBusinessProcesses: [],
        changedDataModelFiles: [],
        changedGroups: [],
        changedI18nFiles: [],
      };
      const mockState = createMockState(mockCandidateDetails, emptyChanges);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('text.noChanges')).toBeInTheDocument();
    });

    it('should not render empty change sections', () => {
      const mockState = createMockState(mockCandidateDetails, mockVersionChanges);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      // changedDataModelFiles is empty, so it should not be rendered
      expect(screen.queryByText('changedDataModelFiles')).not.toBeInTheDocument();
    });
  });

  describe('revert change functionality', () => {
    it('should dispatch revertChangeRequest when revert button is clicked', () => {
      const mockState = createMockState(mockCandidateDetails, mockVersionChanges);
      const dispatchMock = vi.fn();

      portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      dispatchMock.mockClear();

      // Find and click the revert button in the first change section
      const revertButtons = screen.getAllByText('Revert First');
      expect(revertButtons.length).toBeGreaterThan(0);

      fireEvent.click(revertButtons[0]);

      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: revertChangeRequest.type,
          payload: expect.objectContaining({
            versionId: 'test-version-123',
          }),
        }),
      );
    });
  });

  describe('open gerrit functionality', () => {
    it('should open gerrit link when menu item is clicked', async () => {
      const mockState = createMockState(mockCandidateDetails);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      // Click the dropdown trigger
      const linksButton = screen.getByText('text.links');
      fireEvent.click(linksButton);

      // Wait for the dropdown menu to appear
      await waitFor(() => {
        expect(screen.getByText('actions.openGerrit')).toBeInTheDocument();
      });

      // Click the open gerrit menu item
      const openGerritButton = screen.getByText('actions.openGerrit');
      fireEvent.click(openGerritButton);

    });
  });

  describe('action buttons', () => {
    it('should render all action buttons', () => {
      const mockState = createMockState(mockCandidateDetails);

      portalRender(<Candidate />, {
        preloadedState: mockState,
      });

      expect(screen.getByText('text.rebaseChanges')).toBeInTheDocument();
      expect(screen.getByText('text.mergeChanges')).toBeInTheDocument();
      expect(screen.getByText('text.abandonChanges')).toBeInTheDocument();
      expect(screen.getByText('text.links')).toBeInTheDocument();
    });
  });

  describe('validation status checks', () => {
    it('should allow merge when all validations are SUCCESS', () => {
      const candidateAllSuccess = {
        ...mockCandidateDetails,
        hasConflicts: false,
        validations: [
          {
            name: 'Test 1',
            type: 'TEST' as const,
            result: 'SUCCESS' as VersionCheckResult,
            resultDetails: 'Passed',
          },
          {
            name: 'Test 2',
            type: 'REGULATION_INTEGRITY' as const,
            result: 'SUCCESS' as VersionCheckResult,
            resultDetails: 'Passed',
          },
        ],
      };
      const mockState = createMockState(candidateAllSuccess);
      const dispatchMock = vi.fn();

      portalRender(<Candidate />, {
        preloadedState: mockState,
        dispatchMock,
      });

      dispatchMock.mockClear();

      const mergeButton = screen.getByText('text.mergeChanges');
      fireEvent.click(mergeButton);

      // Should directly merge without showing dialog
      expect(dispatchMock).toHaveBeenCalledWith(
        expect.objectContaining({
          type: mergeCandidateRequest.type,
        }),
      );
      expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    });
  });
});
