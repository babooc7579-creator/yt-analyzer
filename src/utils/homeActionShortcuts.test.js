import { describe, expect, it, vi } from 'vitest';

import {
  HOME_ACTION_SHORTCUTS,
  HOME_WORKSPACE_SHORTCUTS,
} from '../constants/homeActionShortcuts';
import {
  getHomeActionShortcutItems,
  getHomeWorkspaceShortcutItems,
} from './homeActionShortcuts';

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

    expect(shortcutsByKey['add-channel'].description).toContain('온라인 저장소(Azure DB)의 채널 목록에 저장');
    expect(shortcutsByKey['add-channel'].description).toContain('영상 수집은 실행하지 않습니다');
    expect(shortcutsByKey['add-channel'].hint).toContain('채널 등록 화면');
    expect(shortcutsByKey['add-channel'].dataFlowLabels).toEqual(['온라인 저장소(Azure DB)의 채널 저장', '영상 수집 없음']);

    expect(shortcutsByKey['selected-scan'].description).toContain('YouTube API');
    expect(shortcutsByKey['selected-scan'].description).toContain('체크한 운영중 채널');
    expect(shortcutsByKey['selected-scan'].hint).toContain('YouTube API 호출 작업');
    expect(shortcutsByKey['selected-scan'].dataFlowLabels).toEqual(['YouTube API 가능', '온라인 저장소(Azure DB)의 수집 영상 정보 갱신 가능']);

    expect(shortcutsByKey.vault.description).toContain('온라인 저장소(Azure DB)');
    expect(shortcutsByKey.vault.description).toContain('수집 영상 정보');
    expect(shortcutsByKey.vault.description).toContain('새 YouTube API 호출은 없습니다');
    expect(shortcutsByKey.vault.hint).toContain('온라인 저장소(Azure DB) 조회');
    expect(shortcutsByKey.vault.dataFlowLabels).toEqual(['온라인 저장소(Azure DB) 조회', '새 API 호출 없음']);

    expect(shortcutsByKey['discovery-links'].description).toContain('온라인 발견함(Azure DB)');
    expect(shortcutsByKey['discovery-links'].description).toContain('제작 후보로 표시');
    expect(shortcutsByKey['discovery-links'].description).not.toContain('제작 후보로 보냅니다');
    expect(shortcutsByKey['discovery-links'].hint).toContain('자동 수집 없이 URL만 저장');
    expect(shortcutsByKey['discovery-links'].dataFlowLabels).toEqual(['온라인 발견함(Azure DB) 저장', '자동 수집 없음']);
  });

  it('maps the three practical workspace shortcuts without invoking handlers', () => {
    const handlers = {
      onOpenKeywordExplorer: vi.fn(),
      onOpenTagVault: vi.fn(),
      onOpenUploadCalendar: vi.fn(),
    };

    const items = getHomeWorkspaceShortcutItems(handlers);

    expect(items.map((item) => item.key)).toEqual(HOME_WORKSPACE_SHORTCUTS.map((item) => item.key));
    expect(items.find((item) => item.key === 'keyword-explorer')?.onClick).toBe(handlers.onOpenKeywordExplorer);
    expect(items.find((item) => item.key === 'tag-vault')?.onClick).toBe(handlers.onOpenTagVault);
    expect(items.find((item) => item.key === 'upload-calendar')?.onClick).toBe(handlers.onOpenUploadCalendar);
    expect(Object.values(handlers).every((handler) => handler.mock.calls.length === 0)).toBe(true);
  });

  it('states that practical workspace shortcuts do not automatically collect or change data', () => {
    const itemsByKey = Object.fromEntries(
      getHomeWorkspaceShortcutItems({}).map((item) => [item.key, item]),
    );

    expect(itemsByKey['keyword-explorer'].description).toContain('수집 영상의 제목');
    expect(itemsByKey['keyword-explorer'].dataFlowLabels).toContain('YouTube API 호출 없음');
    expect(itemsByKey['tag-vault'].description).toContain('기존 채널 태그');
    expect(itemsByKey['tag-vault'].dataFlowLabels).toContain('자동 수집 없음');
    expect(itemsByKey['upload-calendar'].description).toContain('온라인 저장소(Azure DB)의 제작 기록');
    expect(itemsByKey['upload-calendar'].dataFlowLabels).toContain('데이터 변경 없음');
  });
});
