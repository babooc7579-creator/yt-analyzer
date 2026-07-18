export const shouldShowLoginRecovery = (error = '') => {
  const message = typeof error === 'string' ? error.trim() : '';
  if (!message) return false;

  return /\b(401|403)\b|unauthorized|forbidden|로그인|인증|권한|cors|failed to fetch|networkerror|network request|네트워크/i.test(message);
};
