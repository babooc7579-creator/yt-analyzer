import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/appRouteProps', () => ({
  buildChannelWatchlistRouteProps: vi.fn(() => ({ route: 'channel-watchlist' })),
  buildDiscoveryLinksRouteProps: vi.fn(() => ({ route: 'discovery-links' })),
  buildHomeRouteProps: vi.fn(() => ({ route: 'home' })),
  buildKeywordExplorerRouteProps: vi.fn(() => ({ route: 'keyword-explorer' })),
  buildLayoutProps: vi.fn(() => ({ shell: 'layout' })),
  buildLegacyWorkspaceRouteProps: vi.fn(() => ({ route: 'legacy-workspace' })),
  buildRecentScanStatusRouteProps: vi.fn(() => ({ route: 'recent-scan-status' })),
  buildRoutesProps: vi.fn(() => ({ routes: 'creator-os' })),
  buildScriptBoardRouteProps: vi.fn(() => ({ route: 'script-board' })),
  buildSettingsRouteProps: vi.fn(() => ({ route: 'settings' })),
  buildTagVaultRouteProps: vi.fn(() => ({ route: 'tag-vault' })),
  buildTtoTtoRouteProps: vi.fn(() => ({ route: 'ttotto' })),
  buildUploadCalendarRouteProps: vi.fn(() => ({ route: 'upload-calendar' })),
  buildWorkToolsRouteProps: vi.fn(() => ({ route: 'work-tools' })),
}));

import {
  buildChannelWatchlistRouteProps,
  buildDiscoveryLinksRouteProps,
  buildHomeRouteProps,
  buildKeywordExplorerRouteProps,
  buildLayoutProps,
  buildLegacyWorkspaceRouteProps,
  buildRecentScanStatusRouteProps,
  buildRoutesProps,
  buildScriptBoardRouteProps,
  buildSettingsRouteProps,
  buildTagVaultRouteProps,
  buildTtoTtoRouteProps,
  buildUploadCalendarRouteProps,
  buildWorkToolsRouteProps,
} from '../utils/appRouteProps';
import { useCreatorAppViewProps } from './useCreatorAppViewProps';

describe('useCreatorAppViewProps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds layout and route props from the Creator app state', () => {
    const props = {
      activeCreatorItem: { id: 'home', label: '오늘' },
      isChannelWatchlistView: false,
      isComingSoonView: false,
      isDiscoveryLinksView: false,
      isHomeView: true,
      isKeywordExplorerView: false,
      isLegacyWorkspaceView: false,
      isRecentScanStatusView: false,
      isScriptBoardView: false,
      isSettingsView: false,
      isTagVaultView: false,
      isTtoTtoView: false,
      isUploadCalendarView: false,
      isWorkToolsView: false,
      openCreatorView: vi.fn(),
    };

    const viewProps = useCreatorAppViewProps(props);

    expect(buildChannelWatchlistRouteProps).toHaveBeenCalledWith(props);
    expect(buildLayoutProps).toHaveBeenCalledWith(props);
    expect(buildHomeRouteProps).toHaveBeenCalledWith(props);
    expect(buildDiscoveryLinksRouteProps).toHaveBeenCalledWith(props);
    expect(buildKeywordExplorerRouteProps).toHaveBeenCalledWith(props);
    expect(buildLegacyWorkspaceRouteProps).toHaveBeenCalledWith(props);
    expect(buildRecentScanStatusRouteProps).toHaveBeenCalledWith(props);
    expect(buildScriptBoardRouteProps).toHaveBeenCalledWith(props);
    expect(buildSettingsRouteProps).toHaveBeenCalledWith(props);
    expect(buildTagVaultRouteProps).toHaveBeenCalledWith(props);
    expect(buildTtoTtoRouteProps).toHaveBeenCalledWith(props);
    expect(buildUploadCalendarRouteProps).toHaveBeenCalledWith(props);
    expect(buildWorkToolsRouteProps).toHaveBeenCalledWith(props);
    expect(buildRoutesProps).toHaveBeenCalledWith({
      activeCreatorItem: props.activeCreatorItem,
      channelWatchlistRouteProps: { route: 'channel-watchlist' },
      discoveryLinksRouteProps: { route: 'discovery-links' },
      homeRouteProps: { route: 'home' },
      isComingSoonView: false,
      isChannelWatchlistView: false,
      isDiscoveryLinksView: false,
      isHomeView: true,
      isKeywordExplorerView: false,
      isLegacyWorkspaceView: false,
      isRecentScanStatusView: false,
      isScriptBoardView: false,
      isSettingsView: false,
      isTagVaultView: false,
      isTtoTtoView: false,
      isUploadCalendarView: false,
      isWorkToolsView: false,
      keywordExplorerRouteProps: { route: 'keyword-explorer' },
      legacyWorkspaceRouteProps: { route: 'legacy-workspace' },
      recentScanStatusRouteProps: { route: 'recent-scan-status' },
      onOpenHome: expect.any(Function),
      scriptBoardRouteProps: { route: 'script-board' },
      settingsRouteProps: { route: 'settings' },
      ttoTtoRouteProps: { route: 'ttotto' },
      tagVaultRouteProps: { route: 'tag-vault' },
      uploadCalendarRouteProps: { route: 'upload-calendar' },
      workToolsRouteProps: { route: 'work-tools' },
    });
    expect(viewProps).toEqual({
      layoutProps: { shell: 'layout' },
      routesProps: { routes: 'creator-os' },
    });
  });

  it('keeps the home navigation callback connected to the home Creator view', () => {
    const openCreatorView = vi.fn();

    useCreatorAppViewProps({
      activeCreatorItem: { id: 'coming-soon' },
      isChannelWatchlistView: false,
      isComingSoonView: true,
      isDiscoveryLinksView: false,
      isHomeView: false,
      isKeywordExplorerView: false,
      isLegacyWorkspaceView: false,
      isRecentScanStatusView: false,
      isScriptBoardView: false,
      isSettingsView: false,
      isTagVaultView: false,
      isTtoTtoView: false,
      isUploadCalendarView: false,
      isWorkToolsView: false,
      openCreatorView,
    });

    const routesArgs = buildRoutesProps.mock.calls[0][0];

    routesArgs.onOpenHome();

    expect(openCreatorView).toHaveBeenCalledWith({ id: 'home' });
  });
});
