export const guardUnsavedSidebarNavigation = ({
  activeView,
  confirmNavigation,
  hasUnsavedChanges = false,
  message = '',
  onNavigate,
} = {}) => {
  if (typeof onNavigate !== 'function') return undefined;

  return (item, ...args) => {
    if (item?.id && item.id === activeView) return false;

    if (
      hasUnsavedChanges
      && (
        typeof confirmNavigation !== 'function'
        || !confirmNavigation(message)
      )
    ) {
      return false;
    }

    onNavigate(item, ...args);
    return true;
  };
};
