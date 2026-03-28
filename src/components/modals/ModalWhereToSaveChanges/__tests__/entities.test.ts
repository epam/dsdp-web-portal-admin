import { getActionPath } from '../entities';

describe('Entities tests', () => {
  it('getActionPath should return successMasterPath for master', () => {
    expect(getActionPath(true)).toBe('successMasterPath');
  });
  it('getActionPath should return successCandidatePath for candidate', () => {
    expect(getActionPath(false)).toBe('successCandidatePath');
  });
});
