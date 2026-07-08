export const hasCopyableUrlValue = (url) => {
  if (Array.isArray(url)) return url.length > 0;
  if (typeof url === 'string') return url.trim().length > 0;
  return Boolean(url);
};

export const getCopyUrlButtonDefaults = ({
  label = 'URL 복사',
  title,
} = {}) => ({
  copiedLabel: '복사 완료',
  copyingLabel: '복사 중',
  errorLabel: '복사 실패',
  label,
  title: title || `${label} - 클립보드에 복사합니다. API 호출이나 저장 작업은 없습니다.`,
});
