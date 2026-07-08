import { describe, expect, it, vi } from 'vitest';

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

  it('does not invoke shortcut handlers while building the shortcut list', () => {
    const handlers = {
      onOpenAddChannel: vi.fn(),
      onOpenDiscoveryLinks: vi.fn(),
      onOpenSelectedScan: vi.fn(),
      onOpenVault: vi.fn(),
    };

    const items = getHomeActionShortcutItems(handlers);

    expect(items).toHaveLength(HOME_ACTION_SHORTCUTS.length);
    expect(handlers.onOpenAddChannel).not.toHaveBeenCalled();
    expect(handlers.onOpenDiscoveryLinks).not.toHaveBeenCalled();
    expect(handlers.onOpenSelectedScan).not.toHaveBeenCalled();
    expect(handlers.onOpenVault).not.toHaveBeenCalled();
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

  it('keeps home shortcut copy explicit about save, scan, DB lookup, and manual link capture', () => {
    const items = getHomeActionShortcutItems({});
    const shortcutsByKey = Object.fromEntries(items.map((item) => [item.key, item]));

    expect(shortcutsByKey['add-channel'].description).toContain('Cloud 채널 목록에 저장');
    expect(shortcutsByKey['add-channel'].description).toContain('영상 수집은 실행하지 않습니다');
    expect(shortcutsByKey['add-channel'].hint).toContain('채널 등록 화면');

    expect(shortcutsByKey['selected-scan'].description).toContain('YouTube API');
    expect(shortcutsByKey['selected-scan'].description).toContain('체크한 운영중 채널');
    expect(shortcutsByKey['selected-scan'].hint).toContain('YouTube API 호출 작업');

    expect(shortcutsByKey.vault.description).toContain('Cloud DB');
    expect(shortcutsByKey.vault.description).toContain('이미 저장된 영상');
    expect(shortcutsByKey.vault.description).toContain('새 YouTube API 호출은 없습니다');
    expect(shortcutsByKey.vault.hint).toContain('Cloud DB 조회');

    expect(shortcutsByKey['discovery-links'].description).toContain('Cloud 발견함');
    expect(shortcutsByKey['discovery-links'].description).toContain('제작 후보');
    expect(shortcutsByKey['discovery-links'].hint).toContain('자동 수집 없이 URL만 저장');
  });
});
