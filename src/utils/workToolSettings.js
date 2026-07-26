export const getSafeWorkToolUrl = (value) => {
  try {
    const url = new URL(String(value || '').trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
};

export const validateWorkToolPreferences = (preferences = {}) => {
  const customTools = Array.isArray(preferences.customTools)
    ? preferences.customTools
    : [];

  for (const [index, tool] of customTools.entries()) {
    const label = String(tool?.label || '').trim();
    if (!label) {
      return {
        success: false,
        message: `${index + 1}번째 개인 도구의 이름을 입력해 주세요.`,
      };
    }
    if (!getSafeWorkToolUrl(tool?.href)) {
      return {
        success: false,
        message: `${label}의 주소를 https:// 또는 http://로 시작하는 올바른 주소로 입력해 주세요.`,
      };
    }
  }

  return { success: true, message: '' };
};

export const registerWorkToolBeforeUnloadGuard = ({
  hasUnsavedChanges = false,
  target,
} = {}) => {
  if (
    !hasUnsavedChanges
    || !target
    || typeof target.addEventListener !== 'function'
    || typeof target.removeEventListener !== 'function'
  ) {
    return () => {};
  }

  const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = '';
  };

  target.addEventListener('beforeunload', handleBeforeUnload);
  return () => target.removeEventListener('beforeunload', handleBeforeUnload);
};
