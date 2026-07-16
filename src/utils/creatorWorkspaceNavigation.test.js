import { describe, expect, it } from 'vitest';

import { CREATOR_OS_ITEMS } from '../constants/creatorOs';
import {
  getCreatorWorkspaceNavigationState,
  getCreatorWorkspaceViewModel,
  normalizeCreatorWorkspaceItem,
} from './creatorWorkspaceNavigation';

describe('creator workspace navigation utils', () => {
  it('maps every live Creator OS menu to exactly one render route', () => {
    const routeFlags = [
      'isChannelWatchlistView',
      'isDiscoveryLinksView',
      'isHomeView',
      'isKeywordExplorerView',
      'isLegacyWorkspaceView',
      'isSettingsView',
      'isTagVaultView',
      'isTtoTtoView',
      'isUploadCalendarView',
    ];
    const liveItems = CREATOR_OS_ITEMS.filter((item) => item.status === 'live');

    expect(liveItems).toHaveLength(16);
    liveItems.forEach((item) => {
      const model = getCreatorWorkspaceViewModel(item.id);
      const activeRouteCount = routeFlags.filter((flag) => model[flag]).length;

      expect(model.activeCreatorItem.id).toBe(item.id);
      expect(model.isComingSoonView).toBe(false);
      expect(activeRouteCount, `${item.id} should have exactly one render route`).toBe(1);
    });
  });

  it('identifies home, legacy, discovery link, and reference vault views', () => {
    expect(getCreatorWorkspaceViewModel('home')).toMatchObject({
      isChannelWatchlistView: false,
      isComingSoonView: false,
      isDiscoveryLinksView: false,
      isHomeView: true,
      isKeywordExplorerView: false,
      isLegacyWorkspaceView: false,
      isReferenceVaultView: false,
      isSettingsView: false,
      isTagVaultView: false,
      isTtoTtoView: false,
      isUploadCalendarView: false,
    });

    expect(getCreatorWorkspaceViewModel('vault-all')).toMatchObject({
      isHomeView: false,
      isLegacyWorkspaceView: true,
      isReferenceVaultView: true,
    });

    expect(getCreatorWorkspaceViewModel('vault-sources')).toMatchObject({
      isDiscoveryLinksView: true,
      isLegacyWorkspaceView: false,
      isReferenceVaultView: false,
    });

    expect(getCreatorWorkspaceViewModel('discovery-ttotto')).toMatchObject({
      isComingSoonView: false,
      isLegacyWorkspaceView: false,
      isTtoTtoView: true,
    });

    expect(getCreatorWorkspaceViewModel('discovery-watchlist')).toMatchObject({
      isChannelWatchlistView: true,
      isComingSoonView: false,
      isLegacyWorkspaceView: false,
    });

    expect(getCreatorWorkspaceViewModel('discovery-keywords')).toMatchObject({
      isComingSoonView: false,
      isKeywordExplorerView: true,
      isLegacyWorkspaceView: false,
    });

    expect(getCreatorWorkspaceViewModel('vault-tags')).toMatchObject({
      isComingSoonView: false,
      isLegacyWorkspaceView: false,
      isTagVaultView: true,
    });

    expect(getCreatorWorkspaceViewModel('studio-calendar')).toMatchObject({
      isComingSoonView: false,
      isLegacyWorkspaceView: false,
      isUploadCalendarView: true,
    });

    expect(getCreatorWorkspaceViewModel('ops-settings')).toMatchObject({
      isComingSoonView: false,
      isLegacyWorkspaceView: false,
      isSettingsView: true,
    });
  });

  it('marks planned Creator OS views as coming soon', () => {
    const model = getCreatorWorkspaceViewModel('ai-hook');

    expect(model.activeCreatorItem.id).toBe('ai-hook');
    expect(model.isComingSoonView).toBe(true);
  });

  it('opens channel workspaces on the dashboard with the work panel visible', () => {
    expect(getCreatorWorkspaceNavigationState({
      activeTab: 'scrapbook',
      itemId: 'ops-add-channel',
      showWorkPanel: false,
    })).toEqual({
      activeTab: 'dashboard',
      creatorView: 'ops-add-channel',
      showWorkPanel: true,
    });
  });

  it('keeps old channel shortcuts compatible with the unified operations stages', () => {
    expect(normalizeCreatorWorkspaceItem({ id: 'ops-add-channel' })).toEqual({
      id: 'ops-channels',
      intent: { operationStage: 'add' },
    });
    expect(normalizeCreatorWorkspaceItem({ id: 'ops-selected-scan' })).toEqual({
      id: 'ops-channels',
      intent: { operationStage: 'scan' },
    });
    expect(normalizeCreatorWorkspaceItem({ id: 'home' })).toEqual({ id: 'home' });
  });

  it('opens production candidate workspaces on the scrapbook tab without the work panel', () => {
    expect(getCreatorWorkspaceNavigationState({
      activeTab: 'dashboard',
      itemId: 'studio-candidates',
      showWorkPanel: true,
    })).toEqual({
      activeTab: 'scrapbook',
      creatorView: 'studio-candidates',
      showWorkPanel: false,
    });
  });

  it('keeps passive views from changing the current tab or work panel state', () => {
    expect(getCreatorWorkspaceNavigationState({
      activeTab: 'scrapbook',
      itemId: 'home',
      showWorkPanel: true,
    })).toEqual({
      activeTab: 'scrapbook',
      creatorView: 'home',
      showWorkPanel: true,
    });
  });
});
