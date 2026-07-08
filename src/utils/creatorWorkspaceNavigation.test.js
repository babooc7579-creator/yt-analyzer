import { describe, expect, it } from 'vitest';

import {
  getCreatorWorkspaceNavigationState,
  getCreatorWorkspaceViewModel,
} from './creatorWorkspaceNavigation';

describe('creator workspace navigation utils', () => {
  it('identifies home, legacy, discovery link, and reference vault views', () => {
    expect(getCreatorWorkspaceViewModel('home')).toMatchObject({
      isComingSoonView: false,
      isDiscoveryLinksView: false,
      isHomeView: true,
      isLegacyWorkspaceView: false,
      isReferenceVaultView: false,
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
