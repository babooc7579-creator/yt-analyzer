import { describe, expect, it } from 'vitest';

import { HOME_ACTION_SHORTCUTS } from '../constants/homeActionShortcuts';
import { getHomeActionShortcutItems } from './homeActionShortcuts';

describe('homeActionShortcuts utils', () => {
  it('keeps the shortcut item order and public fields from the constants', () => {
    const items = getHomeActionShortcutItems({});

    expect(items.map((item) => item.key)).toEqual(HOME_ACTION_SHORTCUTS.map((item) => item.key));
    expect(items).toHaveLength(HOME_ACTION_SHORTCUTS.length);
    expect(items.every((item) => !Object.hasOwn(item, 'actionName'))).toBe(true);
  });

  it('maps shortcut action names to the matching handlers', () => {
    const onOpenAddChannel = () => 'add channel';
    const onOpenDiscoveryLinks = () => 'discovery links';
    const onOpenSelectedScan = () => 'selected scan';
    const onOpenVault = () => 'vault';

    const items = getHomeActionShortcutItems({
      onOpenAddChannel,
      onOpenDiscoveryLinks,
      onOpenSelectedScan,
      onOpenVault,
    });

    expect(items.find((item) => item.key === 'add-channel')?.onClick).toBe(onOpenAddChannel);
    expect(items.find((item) => item.key === 'selected-scan')?.onClick).toBe(onOpenSelectedScan);
    expect(items.find((item) => item.key === 'vault')?.onClick).toBe(onOpenVault);
    expect(items.find((item) => item.key === 'discovery-links')?.onClick).toBe(onOpenDiscoveryLinks);
  });

  it('leaves missing shortcut handlers undefined instead of inventing fallbacks', () => {
    const items = getHomeActionShortcutItems({
      onOpenVault: () => 'vault',
    });

    expect(items.find((item) => item.key === 'vault')?.onClick).toEqual(expect.any(Function));
    expect(items.find((item) => item.key === 'add-channel')?.onClick).toBeUndefined();
    expect(items.find((item) => item.key === 'selected-scan')?.onClick).toBeUndefined();
    expect(items.find((item) => item.key === 'discovery-links')?.onClick).toBeUndefined();
  });
});
