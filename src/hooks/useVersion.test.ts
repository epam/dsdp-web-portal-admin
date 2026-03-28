import {
  vi, describe, it, expect,
} from 'vitest';
import { useDispatch, useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import { useParams, useLocation, useNavigate } from 'react-router';

import {
  selectVersionsList,
  selectVersionsListIsLoading,
  selectVersionsListIsLoaded,
  selectCreateCandidateIsLoading,
} from 'store/versions/selectors';
import useVersion from 'hooks/useVersion';

vi.mock('react-redux', async (importOriginal) => {
  const redux: typeof import('react-redux') = await importOriginal();
  return {
    ...redux,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

vi.mock('store/versions/selectors', () => {
  return {
    selectVersionsList: vi.fn(),
    selectVersionsListIsLoading: vi.fn(),
    selectVersionsListIsLoaded: vi.fn(),
    selectCreateCandidateIsLoading: vi.fn(),
  };
});

vi.mock('react-router', () => {
  return {
    useLocation: vi.fn(),
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

const useDispatchMock = vi.mocked(useDispatch);
const useSelectorMock = vi.mocked(useSelector);
const useNavigateMock = vi.mocked(useNavigate);
const useParamsMock = vi.mocked(useParams);
const useLocationMock = vi.mocked(useLocation);
const selectVersionsListMock = selectVersionsList as unknown as vi.Mock;
const selectVersionsListIsLoadingMock = selectVersionsListIsLoading as unknown as vi.Mock;
const selectVersionsListIsLoadedMock = selectVersionsListIsLoaded as unknown as vi.Mock;
const selectCreateCandidateIsLoadingMock = selectCreateCandidateIsLoading as unknown as vi.Mock;

const versionsList = ['version1'];

describe('useVersion', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation((fn) => fn());
    useLocationMock.mockReturnValue({ pathname: 'pathname' });
    useParamsMock.mockReturnValue({ versionId: 'master' });
    selectVersionsListMock.mockReturnValue(versionsList);
    selectVersionsListIsLoadingMock.mockReturnValue(true);
    selectVersionsListIsLoadedMock.mockReturnValue(true);
    selectCreateCandidateIsLoadingMock.mockReturnValue(true);
  });

  it('should call navigate', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    const navigateMock = vi.fn();
    useNavigateMock.mockReturnValue(navigateMock);

    const { result } = renderHook(() => useVersion());
    result.current.setVersion('versionId');
    expect(navigateMock).toHaveBeenCalled();
  });

  it('should return versionId from params', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);

    const { result } = renderHook(() => useVersion());
    expect(result.current.versionId).toBe('master');
  });

  it('should return versionsList from selector', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);

    const { result } = renderHook(() => useVersion());
    expect(result.current.versionsList).toBe(versionsList);
  });

  it('should return versionIsLoading from selector', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);

    const { result } = renderHook(() => useVersion());
    expect(result.current.versionIsLoading).toBe(true);
  });
});
