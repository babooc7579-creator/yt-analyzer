import { describe, expect, it } from 'vitest';

import * as appRouteProps from './appRouteProps';
import { buildLayoutProps } from './appLayoutProps';
import { buildChannelWatchlistRouteProps } from './channelWatchlistRouteProps';
import { buildDiscoveryLinksRouteProps } from './discoveryLinksRouteProps';
import { buildHomeRouteProps } from './homeRouteProps';
import { buildKeywordExplorerRouteProps } from './keywordExplorerRouteProps';
import { buildLegacyWorkspaceRouteProps } from './legacyWorkspaceRouteProps';
import { buildRoutesProps } from './routesProps';
import { buildScriptBoardRouteProps } from './scriptBoardRouteProps';
import { buildSettingsRouteProps } from './settingsRouteProps';
import { buildTagVaultRouteProps } from './tagVaultRouteProps';
import { buildTtoTtoRouteProps } from './ttoTtoRouteProps';
import { buildUploadCalendarRouteProps } from './uploadCalendarRouteProps';

describe('appRouteProps barrel exports', () => {
  it('exposes the app route and layout prop builders', () => {
    expect(Object.keys(appRouteProps).sort()).toEqual([
      'buildChannelWatchlistRouteProps',
      'buildDiscoveryLinksRouteProps',
      'buildHomeRouteProps',
      'buildKeywordExplorerRouteProps',
      'buildLayoutProps',
      'buildLegacyWorkspaceRouteProps',
      'buildRoutesProps',
      'buildScriptBoardRouteProps',
      'buildSettingsRouteProps',
      'buildTagVaultRouteProps',
      'buildTtoTtoRouteProps',
      'buildUploadCalendarRouteProps',
      'buildWorkToolsRouteProps',
    ]);
  });

  it('re-exports the same helper functions from their source modules', () => {
    expect(appRouteProps.buildChannelWatchlistRouteProps).toBe(buildChannelWatchlistRouteProps);
    expect(appRouteProps.buildDiscoveryLinksRouteProps).toBe(buildDiscoveryLinksRouteProps);
    expect(appRouteProps.buildHomeRouteProps).toBe(buildHomeRouteProps);
    expect(appRouteProps.buildKeywordExplorerRouteProps).toBe(buildKeywordExplorerRouteProps);
    expect(appRouteProps.buildLayoutProps).toBe(buildLayoutProps);
    expect(appRouteProps.buildLegacyWorkspaceRouteProps).toBe(buildLegacyWorkspaceRouteProps);
    expect(appRouteProps.buildRoutesProps).toBe(buildRoutesProps);
    expect(appRouteProps.buildScriptBoardRouteProps).toBe(buildScriptBoardRouteProps);
    expect(appRouteProps.buildSettingsRouteProps).toBe(buildSettingsRouteProps);
    expect(appRouteProps.buildTagVaultRouteProps).toBe(buildTagVaultRouteProps);
    expect(appRouteProps.buildTtoTtoRouteProps).toBe(buildTtoTtoRouteProps);
    expect(appRouteProps.buildUploadCalendarRouteProps).toBe(buildUploadCalendarRouteProps);
  });
});
