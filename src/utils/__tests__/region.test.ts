import { isGlobal } from '../region';

describe('region', () => {
  describe('isGlobal', () => {
    it('should return true', () => {
      expect(isGlobal('global')).toBeTruthy();
    });

    it('should return false', () => {
      expect(isGlobal('ua')).toBeFalsy();
    });
  });
});
