import { Bookmark, Link as LinkIcon, Plus, RefreshCw } from 'lucide-react';

import { getHomeActionShortcutItems } from '../utils/homeActionShortcuts';
import HomeActionShortcutButton from './HomeActionShortcutButton';

const HOME_ACTION_SHORTCUT_ICONS = {
  bookmark: Bookmark,
  link: LinkIcon,
  plus: Plus,
  refresh: RefreshCw,
};

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

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-4">
      {shortcutItems.map((shortcut) => (
        <HomeActionShortcutButton
          key={shortcut.key}
          {...shortcut}
          icon={HOME_ACTION_SHORTCUT_ICONS[shortcut.iconName]}
        />
      ))}
    </div>
  );
}
