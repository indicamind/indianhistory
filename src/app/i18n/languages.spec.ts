import { LANGUAGES, languageFromUrl } from './languages';

describe('Languages and i18n Helpers', () => {
  it('should define all 26 supported languages', () => {
    expect(LANGUAGES.length).toBe(26);
    const codes = LANGUAGES.map(l => l.code);
    const expected = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'ur', 'gu', 'kn', 'ml', 'pa', 'sa', 'es', 'fr', 'ar', 'zh', 'pt', 'or', 'si', 'ja', 'ne', 'id', 'th', 'de', 'fa', 'ru'];
    for (const code of expected) {
      expect(codes).toContain(code);
    }
  });

  it('should correctly configure text direction for RTL languages', () => {
    const urdu = LANGUAGES.find(l => l.code === 'ur');
    expect(urdu?.direction).toBe('rtl');

    const arabic = LANGUAGES.find(l => l.code === 'ar');
    expect(arabic?.direction).toBe('rtl');

    const persian = LANGUAGES.find(l => l.code === 'fa');
    expect(persian?.direction).toBe('rtl');

    const english = LANGUAGES.find(l => l.code === 'en');
    expect(english?.direction).toBe('ltr');

    const hindi = LANGUAGES.find(l => l.code === 'hi');
    expect(hindi?.direction).toBe('ltr');
  });

  it('should extract valid language from URL param string', () => {
    expect(languageFromUrl('hi')).toBe('hi');
    expect(languageFromUrl('sa')).toBe('sa');
    expect(languageFromUrl('ta')).toBe('ta');
    expect(languageFromUrl('fr')).toBe('fr');
    expect(languageFromUrl('en')).toBe('en');
  });

  it('should default to "en" when param is null, empty, or unsupported', () => {
    expect(languageFromUrl(null)).toBe('en');
    expect(languageFromUrl('')).toBe('en');
    expect(languageFromUrl('unsupported-lang')).toBe('en');
  });
});
