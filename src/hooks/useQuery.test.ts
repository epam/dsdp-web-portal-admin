/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  vi, describe, it, expect,
} from 'vitest';

import { useLocation } from 'react-router';
import useQuery from './useQuery';

vi.mock('react-router', () => {
  return {
    useLocation: vi.fn(),
  };
});

const useLocationMock = vi.mocked(useLocation);
const URLSearchParamsMock = vi.spyOn(global, 'URLSearchParams').mockImplementation(
  // eslint-disable-next-line prefer-arrow-callback
  function mockedConstructor(init?: string | string[][] | Record<string, string> | URLSearchParams): any {
    return init;
  },
);

describe('useQuery', () => {
  beforeEach(() => {
    useLocationMock.mockReturnValue({ search: 'someString' } as any);
  });

  it('should call URLSearchParams constructor with location.search', () => {
    useQuery();
    expect(URLSearchParamsMock).toHaveBeenCalledWith('someString');
  });
});
