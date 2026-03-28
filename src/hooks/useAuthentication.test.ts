import {
  vi, describe, it, expect,
} from 'vitest';
import { useDispatch, useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import {
  getInfoRequest,
  selectCurrentUserInitialized,
  selectCurrentUserInfo,
} from 'store/currentUser';
import useVersion from 'hooks/useVersion';
import useAuthentication from './useAuthentication';

vi.mock('react-redux', async (importOriginal) => {
  const redux: typeof import('react-redux') = await importOriginal();
  return {
    ...redux,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

vi.mock('store/currentUser/selectors', () => {
  return {
    selectCurrentUserInitialized: vi.fn(),
    selectCurrentUserAuthenticated: vi.fn(),
    selectCurrentUserInfo: vi.fn(),
    selectCurrentUserError: vi.fn(),
  };
});

vi.mock('react-router', () => {
  return {
    useLocation: vi.fn(),
  };
});

vi.mock('hooks/useVersion', () => ({ default: vi.fn() }));

const useDispatchMock = vi.mocked(useDispatch);
const useSelectorMock = vi.mocked(useSelector);
const selectCurrentUserInitializedMock = selectCurrentUserInitialized as unknown as vi.Mock;
const selectCurrentUserInfoMock = selectCurrentUserInfo as unknown as vi.Mock;
const useVersionMock = vi.mocked(useVersion);

describe('useAuthentication', () => {
  beforeEach(() => {
    useSelectorMock.mockImplementation((fn) => fn());
    useVersionMock.mockReturnValue({ versionId: ':versionId' });
  });

  it('should call dispatch with loginRequest action when login method called', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete window.location;
    (window.location as unknown as { assign: () => void }) = { assign: vi.fn() };
    const { result } = renderHook(() => useAuthentication());
    result.current.login();
    expect(window.location.assign).toHaveBeenCalled();
  });

  it('should call dispatch with getInfoRequest action when auth is not initialized', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    selectCurrentUserInitializedMock.mockReturnValueOnce(false);
    renderHook(() => useAuthentication());
    expect(mockDispatch).toHaveBeenCalledWith(getInfoRequest());
  });

  it('should not call dispatch with getInfoRequest action when auth is not initialized', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    selectCurrentUserInitializedMock.mockReturnValueOnce(true);
    renderHook(() => useAuthentication());
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should return true, access only for admin', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    selectCurrentUserInfoMock.mockReturnValueOnce({ roles: ['admin'] });
    const { result } = renderHook(() => useAuthentication());
    expect(result.current.hasRealmRole('admin')).toEqual(true);
  });

  it('should return false, access only for officer', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    selectCurrentUserInfoMock.mockReturnValueOnce({ roles: ['admin'] });
    const { result } = renderHook(() => useAuthentication());
    expect(result.current.hasRealmRole('officer')).toEqual(false);
  });

  it('should return false, roles do not exist', () => {
    const mockDispatch = vi.fn();
    useDispatchMock.mockReturnValue(mockDispatch);
    selectCurrentUserInfoMock.mockReturnValueOnce({});
    const { result } = renderHook(() => useAuthentication());
    expect(result.current.hasRealmRole('admin')).toEqual(false);
  });
});
