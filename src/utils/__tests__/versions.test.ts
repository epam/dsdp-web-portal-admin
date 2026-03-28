import { isMaster, getRoutePathWithVersion } from '../versions';

describe('versions', () => {
  describe('isMaster', () => {
    it('should return true', () => {
      expect(isMaster('master')).toBeTruthy();
    });

    it('should return false', () => {
      expect(isMaster('some_version')).toBeFalsy();
    });
  });

  describe('getRoutePathWithVersion', () => {
    it('should replace path', () => {
      expect(getRoutePathWithVersion('/:versionId/path', 'versionId')).toEqual('/versionId/path');
    });
  });
});
