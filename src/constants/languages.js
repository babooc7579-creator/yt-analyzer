export const LANGUAGES = [
  { code: 'KR', label: '🇰🇷 KR', name: '한국어' },
  { code: 'EN', label: '🇺🇸 EN', name: '영어' },
  { code: 'JP', label: '🇯🇵 JP', name: '일본어' },
  { code: 'ES', label: '🇪🇸 ES', name: '스페인어' },
  { code: 'ETC', label: '🌐 기타', name: '기타 언어' },
];

export const getLanguageLabel = (languageCode) => {
  return LANGUAGES.find((language) => language.code === languageCode)?.label || '';
};
