import { describe, expect, it } from 'vitest';

import * as appRouteProps from './appRouteProps';
import { buildLayoutProps } from './appLayoutProps';
import { buildChannelWatchlistRouteProps } from './channelWatchlistRouteProps';
import { buildDiscoveryLinksRouteProps } from './discoveryLinksRouteProps';
import { buildHomeRouteProps } from './homeRouteProps';
import { buildLegacyWorkspaceRouteProps } from './legacyWorkspaceRouteProps';
import { buildRoutesProps } from './routesProps';
import { buildTtoTtoRouteProps } from './ttoTtoRouteProps';

describe('appRouteProps barrel exports', () => {
  it('exposes the app route and layout prop builders', () => {
    expect(Object.keys(appRouteProps).sort()).toEqual([
      'buildChannelWatchlistRouteProps',
      'buildDiscoveryLinksRouteProps',
      'buildHomeRouteProps',
      'buildLayoutProps',
      'buildLegacyWorkspaceRouteProps',
      'buildRoutesProps',
      'buildTtoTtoRouteProps',
    ]);
  });

  it('re-exports the same helper functions from their source modules', () => {
    expect(appRouteProps.buildChannelWatchlistRouteProps).toBe(buildChannelWatchlistRouteProps);
    expect(appRouteProps.buildDiscoveryLinksRouteProps).toBe(buildDiscoveryLinksRouteProps);
    expect(appRouteProps.buildHomeRouteProps).toBe(buildHomeRouteProps);
    expect(appRouteProps.buildLayoutProps).toBe(buildLayoutProps);
    expect(appRouteProps.buildLegacyWorkspaceRouteProps).toBe(buildLegacyWorkspaceRouteProps);
    expect(appRouteProps.buildRoutesProps).toBe(buildRoutesProps);
    expect(appRouteProps.buildTtoTtoRouteProps).toBe(buildTtoTtoRouteProps);
  });
});
