export const LANGUAGES = [
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'hi', name: 'हिन्दी', direction: 'ltr' },
  { code: 'bn', name: 'বাংলা', direction: 'ltr' },
  { code: 'ta', name: 'தமிழ்', direction: 'ltr' },
  { code: 'te', name: 'తెలుగు', direction: 'ltr' },
  { code: 'mr', name: 'मराठी', direction: 'ltr' },
  { code: 'ur', name: 'اردو', direction: 'rtl' },
  { code: 'gu', name: 'ગુજરાતી', direction: 'ltr' },
  { code: 'kn', name: 'ಕನ್ನಡ', direction: 'ltr' },
  { code: 'ml', name: 'മലയാളം', direction: 'ltr' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', direction: 'ltr' },
  { code: 'sa', name: 'संस्कृतम्', direction: 'ltr' },
  { code: 'es', name: 'Español', direction: 'ltr' },
  { code: 'fr', name: 'Français', direction: 'ltr' },
  { code: 'ar', name: 'العربية', direction: 'rtl' },
  { code: 'zh', name: '中文', direction: 'ltr' },
  { code: 'pt', name: 'Português', direction: 'ltr' },
  { code: 'or', name: 'ଓଡ଼ିଆ', direction: 'ltr' },
  { code: 'si', name: 'සිංහල', direction: 'ltr' },
  { code: 'ja', name: '日本語', direction: 'ltr' },
  { code: 'ne', name: 'नेपाली', direction: 'ltr' },
  { code: 'id', name: 'Bahasa Indonesia', direction: 'ltr' },
  { code: 'th', name: 'ไทย', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', direction: 'ltr' },
  { code: 'fa', name: 'فارسی', direction: 'rtl' },
  { code: 'ru', name: 'Русский', direction: 'ltr' },
  { code: 'ks', name: 'کٲشُر', direction: 'rtl' },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]['code'];

export function languageFromUrl(value: string | null): LanguageCode {
  return LANGUAGES.find(language => language.code === value)?.code ?? 'en';
}
