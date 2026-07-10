import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../utils/appRouteProps', () => ({
  buildDiscoveryLinksRouteProps: vi.fn(() => ({ route: 'discovery-links' })),
  buildHomeRouteProps: vi.fn(() => ({ route: 'home' })),
  buildLayoutProps: vi.fn(() => ({ shell: 'layout' })),
  buildLegacyWorkspaceRouteProps: vi.fn(() => ({ route: 'legacy-workspace' })),
  buildRoutesProps: vi.fn(() => ({ routes: 'creator-os' })),
}));

import {
  buildDiscoveryLinksRouteProps,
  buildHomeRouteProps,
  buildLayoutProps,
  buildLegacyWorkspaceRouteProps,
  buildRoutesProps,
} from '../utils/appRouteProps';
import { useCreatorAppViewProps } from './useCreatorAppViewProps';

describe('useCreatorAppViewProps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('builds layout and route props from the Creator app state', () => {
    const props = {
      activeCreatorItem: { id: 'home', label: '오늘' },
      isComingSoonView: false,
      isDiscoveryLinksView: false,
      isHomeView: true,
      isLegacyWorkspaceView: false,
      openCreatorView: vi.fn(),
    };

    const viewProps = useCreatorAppViewProps(props);

    expect(buildLayoutProps).toHaveBeenCalledWith(props);
    expect(buildHomeRouteProps).toHaveBeenCalledWith(props);
    expect(buildDiscoveryLinksRouteProps).toHaveBeenCalledWith(props);
    expect(buildLegacyWorkspaceRouteProps).toHaveBeenCalledWith(props);
    expect(buildRoutesProps).toHaveBeenCalledWith({
      activeCreatorItem: props.activeCreatorItem,
      discoveryLinksRouteProps: { route: 'discovery-links' },
      homeRouteProps: { route: 'home' },
      isComingSoonView: false,
      isDiscoveryLinksView: false,
      isHomeView: true,
      isLegacyWorkspaceView: false,
      legacyWorkspaceRouteProps: { route: 'legacy-workspace' },
      onOpenHome: expect.any(Function),
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
      isComingSoonView: true,
      isDiscoveryLinksView: false,
      isHomeView: false,
      isLegacyWorkspaceView: false,
      openCreatorView,
    });

    const routesArgs = buildRoutesProps.mock.calls[0][0];

    routesArgs.onOpenHome();

    expect(openCreatorView).toHaveBeenCalledWith({ id: 'home' });
  });
});
