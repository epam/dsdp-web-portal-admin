import { useLocation } from 'react-router';
import useEntityMode from './useEntityMode';

vi.mock('react-router', () => {
  return {
    useLocation: vi.fn(),
  };
});

const useLocationMock = vi.mocked(useLocation);

describe('useEntityMode', () => {
  it('should return correct mode', () => {
    useLocationMock.mockReturnValue({ search: 'mode=preview' });
    const mode = useEntityMode();
    expect(mode).toBe('preview');
  });
  it('should return common mode if no mode in query', () => {
    useLocationMock.mockReturnValue({ search: '' });
    const mode = useEntityMode();
    expect(mode).toBe('common');
  });
});
