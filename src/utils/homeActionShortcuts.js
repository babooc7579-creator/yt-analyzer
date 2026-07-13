import {
  HOME_ACTION_SHORTCUTS,
  HOME_WORKSPACE_SHORTCUTS,
} from '../constants/homeActionShortcuts';

export const getHomeActionShortcutItems = ({
  onOpenAddChannel,
  onOpenDiscoveryLinks,
  onOpenSelectedScan,
  onOpenVault,
}) => {
  const actionsByName = {
    openAddChannel: onOpenAddChannel,
    openDiscoveryLinks: onOpenDiscoveryLinks,
    openSelectedScan: onOpenSelectedScan,
    openVault: onOpenVault,
  };

  return HOME_ACTION_SHORTCUTS.map(({ actionName, ...shortcut }) => ({
    ...shortcut,
    onClick: actionsByName[actionName],
  }));
};

export const getHomeWorkspaceShortcutItems = ({
  onOpenKeywordExplorer,
  onOpenTagVault,
  onOpenUploadCalendar,
}) => {
  const actionsByName = {
    openKeywordExplorer: onOpenKeywordExplorer,
    openTagVault: onOpenTagVault,
    openUploadCalendar: onOpenUploadCalendar,
  };

  return HOME_WORKSPACE_SHORTCUTS.map(({ actionName, ...shortcut }) => ({
    ...shortcut,
    onClick: actionsByName[actionName],
  }));
};
