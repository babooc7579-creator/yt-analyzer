export const PRODUCTION_UNSAVED_NAVIGATION_MESSAGE = [
  'Cloud에 저장하지 않은 제작안이 있습니다.',
  '저장하지 않고 다른 화면으로 이동할까요?',
].join('\n');

export const guardProductionNavigation = ({
  confirmNavigation,
  hasUnsavedDrafts = false,
  onNavigate,
} = {}) => {
  if (typeof onNavigate !== 'function') return undefined;

  return (...args) => {
    if (!hasUnsavedDrafts) {
      onNavigate(...args);
      return true;
    }

    if (
      typeof confirmNavigation !== 'function'
      || !confirmNavigation(PRODUCTION_UNSAVED_NAVIGATION_MESSAGE)
    ) {
      return false;
    }

    onNavigate(...args);
    return true;
  };
};

export const getGuardedProductionNavigationHandlers = ({
  confirmNavigation,
  hasUnsavedDrafts = false,
  handlers = {},
} = {}) => Object.fromEntries(
  Object.entries(handlers).map(([key, onNavigate]) => [
    key,
    guardProductionNavigation({
      confirmNavigation,
      hasUnsavedDrafts,
      onNavigate,
    }),
  ]),
);
