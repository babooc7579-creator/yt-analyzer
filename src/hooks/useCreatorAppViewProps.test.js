import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/appRouteProps', () => ({
  buildChannelWatchlistRouteProps: vi.fn(() => ({ route: 'channel-watchlist' })),
  buildDiscoveryLinksRouteProps: vi.fn(() => ({ route: 'discovery-links' })),
  buildHomeRouteProps: vi.fn(() => ({ route: 'home' })),
  buildLayoutProps: vi.fn(() => ({ shell: 'layout' })),
  buildLegacyWorkspaceRouteProps: vi.fn(() => ({ route: 'legacy-workspace' })),
  buildRoutesProps: vi.fn(() => ({ routes: 'creator-os' })),
  buildTtoTtoRouteProps: vi.fn(() => ({ route: 'ttotto' })),
}));

import {
  buildChannelWatchlistRouteProps,
  buildDiscoveryLinksRouteProps,
  buildHomeRouteProps,
  buildLayoutProps,
  buildLegacyWorkspaceRouteProps,
  buildRoutesProps,
  buildTtoTtoRouteProps,
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
      isLegacyWorkspaceView: false,
      isTtoTtoView: false,
      openCreatorView: vi.fn(),
    };

    const viewProps = useCreatorAppViewProps(props);

    expect(buildChannelWatchlistRouteProps).toHaveBeenCalledWith(props);
    expect(buildLayoutProps).toHaveBeenCalledWith(props);
    expect(buildHomeRouteProps).toHaveBeenCalledWith(props);
    expect(buildDiscoveryLinksRouteProps).toHaveBeenCalledWith(props);
    expect(buildLegacyWorkspaceRouteProps).toHaveBeenCalledWith(props);
    expect(buildTtoTtoRouteProps).toHaveBeenCalledWith(props);
    expect(buildRoutesProps).toHaveBeenCalledWith({
      activeCreatorItem: props.activeCreatorItem,
      channelWatchlistRouteProps: { route: 'channel-watchlist' },
      discoveryLinksRouteProps: { route: 'discovery-links' },
      homeRouteProps: { route: 'home' },
      isComingSoonView: false,
      isChannelWatchlistView: false,
      isDiscoveryLinksView: false,
      isHomeView: true,
      isLegacyWorkspaceView: false,
      isTtoTtoView: false,
      legacyWorkspaceRouteProps: { route: 'legacy-workspace' },
      onOpenHome: expect.any(Function),
      ttoTtoRouteProps: { route: 'ttotto' },
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
      isLegacyWorkspaceView: false,
      isTtoTtoView: false,
      openCreatorView,
    });

    const routesArgs = buildRoutesProps.mock.calls[0][0];

    routesArgs.onOpenHome();

    expect(openCreatorView).toHaveBeenCalledWith({ id: 'home' });
  });
});
