import { describe, expect, it } from 'vitest';

import { buildRoutesProps } from './routesProps';

describe('routesProps utils', () => {
  it('builds route props from the current view flags and route data', () => {
    const activeCreatorItem = { id: 'today' };
    const discoveryLinksRouteProps = { links: [] };
    const homeRouteProps = { selectedChannelCount: 2 };
    const legacyWorkspaceRouteProps = { totalVideoCount: 3 };

    const props = buildRoutesProps({
      activeCreatorItem,
      discoveryLinksRouteProps,
      homeRouteProps,
      isComingSoonView: false,
      isDiscoveryLinksView: true,
      isHomeView: false,
      isLegacyWorkspaceView: false,
      legacyWorkspaceRouteProps,
    });

    expect(props).toMatchObject({
      activeCreatorItem,
      discoveryLinksRouteProps,
      homeRouteProps,
      isComingSoonView: false,
      isDiscoveryLinksView: true,
      isHomeView: false,
      isLegacyWorkspaceView: false,
      legacyWorkspaceRouteProps,
    });
  });

  it('forwards the home navigation handler without invoking it', () => {
    const onOpenHome = () => 'home';

    const props = buildRoutesProps({
      onOpenHome,
    });

    expect(props.onOpenHome).toBe(onOpenHome);
  });
});
