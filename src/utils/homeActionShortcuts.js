import { HOME_ACTION_SHORTCUTS } from '../constants/homeActionShortcuts';

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
