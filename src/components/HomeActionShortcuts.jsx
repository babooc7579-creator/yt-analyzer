import { Bookmark, Link as LinkIcon, Plus, RefreshCw } from 'lucide-react';

import { getHomeActionShortcutItems } from '../utils/homeActionShortcuts';
import HomeActionShortcutButton from './HomeActionShortcutButton';

const HOME_ACTION_SHORTCUT_ICONS = {
  bookmark: Bookmark,
  link: LinkIcon,
  plus: Plus,
  refresh: RefreshCw,
};

const toArray = (items) => (Array.isArray(items) ? items : []);

export default function HomeActionShortcuts({
  onOpenAddChannel,
  onOpenDiscoveryLinks,
  onOpenSelectedScan,
  onOpenVault,
}) {
  const shortcutItems = getHomeActionShortcutItems({
    onOpenAddChannel,
    onOpenDiscoveryLinks,
    onOpenSelectedScan,
    onOpenVault,
  });
  const shortcuts = toArray(shortcutItems);

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-4">
      {shortcuts.map(({ key, ...shortcut }) => (
        <HomeActionShortcutButton
          key={key}
          {...shortcut}
          icon={HOME_ACTION_SHORTCUT_ICONS[shortcut.iconName]}
        />
      ))}
    </div>
  );
}
