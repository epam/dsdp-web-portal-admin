import ISO6391 from 'iso-639-1';

export function getLanguageNativeName(lang: string): string {
  return `${lang.toUpperCase()} - ${ISO6391.getNativeName(lang)}`;
}
