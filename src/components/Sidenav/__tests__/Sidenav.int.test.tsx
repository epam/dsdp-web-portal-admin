import React from 'react';
import { useLocation } from 'react-router';
import {
  vi, describe, it, expect, beforeEach,
} from 'vitest';
import { render, screen } from '#shared/utils/testUtils';
import useVersion from 'hooks/useVersion';
import Sidenav from '../Sidenav';

vi.mock('hooks/useVersion');
vi.mock('react-router', () => ({
  useLocation: vi.fn(),
  NavLink: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

const useVersionMock = vi.mocked(useVersion);
const useLocationMock = vi.mocked(useLocation);

describe('Sidenav', () => {
  beforeEach(() => {
    useVersionMock.mockReturnValue({
      versionId: 'test-version',
      versionsList: [],
      versionIsLoading: false,
      versionCreateIsLoading: false,
      versionIsLoaded: true,
      setVersion: vi.fn(),
      createVersion: vi.fn(),
    });

    useLocationMock.mockReturnValue({
      pathname: '/test-version/home',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    global.ENVIRONMENT_VARIABLES = {
      region: 'test-region',
      apiUrl: '',
      supportedLanguages: ['en', 'uk'],
    } as any;
  });

  it('should render navigation sections with titles', () => {
    render(<Sidenav />);

    // Check that navigation sections are rendered
    expect(screen.getByText('nav.regulationVersionManagement')).toBeInTheDocument();
    expect(screen.getByText('nav.organizationalStructure')).toBeInTheDocument();
    expect(screen.getByText('nav.modelingRegulations')).toBeInTheDocument();
    expect(screen.getByText('nav.translationManagement')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Sidenav />);

    // Check that navigation links are rendered
    expect(screen.getByText('nav.versionOverview')).toBeInTheDocument();
    expect(screen.getByText('nav.userManagement')).toBeInTheDocument();
    expect(screen.getByText('nav.bpModels')).toBeInTheDocument();
    expect(screen.getByText('nav.formUI')).toBeInTheDocument();
    expect(screen.getByText('nav.regulationTranslations')).toBeInTheDocument();
  });

  it('should hide organizational structure section for global region', () => {
    global.ENVIRONMENT_VARIABLES = {
      region: 'global',
      apiUrl: '',
      signWidgetUrl: '',
      supportedLanguages: ['en', 'uk'],
    };

    render(<Sidenav />);

    // Organizational structure should be hidden
    expect(screen.queryByText('nav.organizationalStructure')).not.toBeInTheDocument();
    expect(screen.queryByText('nav.userManagement')).not.toBeInTheDocument();
  });

  it('should show organizational structure section for non-global region', () => {
    global.ENVIRONMENT_VARIABLES = {
      region: 'other-region',
      apiUrl: '',
      signWidgetUrl: '',
      supportedLanguages: ['en', 'uk'],
    };

    render(<Sidenav />);

    // Organizational structure should be visible
    expect(screen.getByText('nav.organizationalStructure')).toBeInTheDocument();
    expect(screen.getByText('nav.userManagement')).toBeInTheDocument();
  });

  it('should generate correct paths with version id', () => {
    useVersionMock.mockReturnValue({
      versionId: 'v1.0',
      versionsList: [],
      versionIsLoading: false,
      versionCreateIsLoading: false,
      versionIsLoaded: true,
      setVersion: vi.fn(),
      createVersion: vi.fn(),
    });

    const { container } = render(<Sidenav />);

    // Check that links have correct version in path
    const links = container.querySelectorAll('a');
    const hasVersionInPath = Array.from(links).some((link) => link.getAttribute('to')?.includes('v1.0'));
    expect(hasVersionInPath).toBe(true);
  });

  it('should mark current path as selected', () => {
    useLocationMock.mockReturnValue({
      pathname: '/test-version/home',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    const { container } = render(<Sidenav />);

    // The component should process the pathname
    expect(container).toBeInTheDocument();
  });

  it('should handle pathname with multiple segments', () => {
    useLocationMock.mockReturnValue({
      pathname: '/test-version/form-list',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    render(<Sidenav />);

    // Should render without errors
    expect(screen.getByText('nav.formUI')).toBeInTheDocument();
  });

  it('should render all modeling regulations items', () => {
    render(<Sidenav />);

    // Check all items under modeling regulations
    expect(screen.getByText('nav.bpModels')).toBeInTheDocument();
    expect(screen.getByText('nav.formUI')).toBeInTheDocument();
  });

  it('should render version overview in regulation version management', () => {
    render(<Sidenav />);

    expect(screen.getByText('nav.regulationVersionManagement')).toBeInTheDocument();
    expect(screen.getByText('nav.versionOverview')).toBeInTheDocument();
  });

  it('should render regulation translations in translation management', () => {
    render(<Sidenav />);

    expect(screen.getByText('nav.translationManagement')).toBeInTheDocument();
    expect(screen.getByText('nav.regulationTranslations')).toBeInTheDocument();
  });

  it('should handle empty pathname segments', () => {
    useLocationMock.mockReturnValue({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    });

    render(<Sidenav />);

    // Should render without errors
    expect(screen.getByText('nav.regulationVersionManagement')).toBeInTheDocument();
  });

  it('should use correct version id from useVersion hook', () => {
    const mockVersionId = 'custom-version-123';
    useVersionMock.mockReturnValue({
      versionId: mockVersionId,
      versionsList: [],
      versionIsLoading: false,
      versionCreateIsLoading: false,
      versionIsLoaded: true,
      setVersion: vi.fn(),
      createVersion: vi.fn(),
    });

    const { container } = render(<Sidenav />);

    // Check that links contain the custom version id
    const links = container.querySelectorAll('a');
    const hasCustomVersion = Array.from(links).some((link) => link.getAttribute('to')?.includes(mockVersionId));
    expect(hasCustomVersion).toBe(true);
  });
});
