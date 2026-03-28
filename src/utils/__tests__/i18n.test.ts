import { describe, it, expect } from 'vitest';
import { getLanguageNativeName } from '../i18n';

describe('i18n utils', () => {
  it.each([
    ['en', 'EN - English'],
    ['uk', 'UK - Українська'],
    ['fr', 'FR - Français'],
  ])('should return native name', (name, result) => {
    expect(getLanguageNativeName(name)).toEqual(result);
  });
});
