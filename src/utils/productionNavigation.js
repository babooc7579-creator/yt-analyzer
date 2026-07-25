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

export const guardProductionSidebarNavigation = ({
  activeView,
  confirmNavigation,
  hasUnsavedDrafts = false,
  onNavigate,
} = {}) => {
  const guardedNavigate = guardProductionNavigation({
    confirmNavigation,
    hasUnsavedDrafts,
    onNavigate,
  });
  if (typeof guardedNavigate !== 'function') return undefined;

  return (item, ...args) => {
    if (item?.id && item.id === activeView) return false;
    return guardedNavigate(item, ...args);
  };
};

export const guardProductionTabNavigation = ({
  activeTab,
  confirmNavigation,
  hasUnsavedDrafts = false,
  onSelectTab,
} = {}) => {
  const guardedSelectTab = guardProductionNavigation({
    confirmNavigation,
    hasUnsavedDrafts,
    onNavigate: onSelectTab,
  });
  if (typeof guardedSelectTab !== 'function') return undefined;

  return (nextTab) => {
    if (nextTab === activeTab) return false;
    return guardedSelectTab(nextTab);
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

export const registerProductionBeforeUnloadGuard = ({
  hasUnsavedDrafts = false,
  target,
} = {}) => {
  if (
    !hasUnsavedDrafts
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
