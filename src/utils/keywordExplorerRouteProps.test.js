import { describe, expect, it, vi } from 'vitest';

import { buildKeywordExplorerRouteProps } from './keywordExplorerRouteProps';

describe('keywordExplorerRouteProps', () => {
  it('connects stored-video actions without invoking them while building props', () => {
    const openCreatorView = vi.fn();
    const setAddMode = vi.fn();
    const setChannelPreview = vi.fn();
    const setNewChannelInput = vi.fn();
    const props = buildKeywordExplorerRouteProps({
      addDiscoveryLink: vi.fn(),
      checkedVideos: ['v1'],
      discoveryLinks: [{ id: 'link-1' }],
      discoveryLinksSaving: true,
      loading: true,
      openCreatorView,
      selectedChannelIds: ['c1', 'c2'],
      savedChannels: [{ id: 'registered-1' }],
      setAddMode,
      setChannelPreview,
      setNewChannelInput,
      videos: [{ videoId: 'v1' }],
    });

    expect(props).toMatchObject({
      checkedVideos: ['v1'],
      discoveryLinks: [{ id: 'link-1' }],
      discoveryLinksSaving: true,
      loading: true,
      selectedChannelCount: 2,
      selectedChannelKey: 'c1|c2',
      registeredChannelIds: ['registered-1'],
      videos: [{ videoId: 'v1' }],
    });
    expect(openCreatorView).not.toHaveBeenCalled();

    props.onOpenChannelWatchlist();
    props.onOpenSelectedScan();
    props.onOpenVault();
    props.onOpenWorkTools();
    props.onOpenDiscoveryLinks();
    props.onPrepareChannelRegistration({ channelId: 'new-channel', url: 'https://www.youtube.com/channel/new-channel' });
    expect(setAddMode).toHaveBeenCalledWith('single');
    expect(setChannelPreview).toHaveBeenCalledWith(null);
    expect(setNewChannelInput).toHaveBeenCalledWith('https://www.youtube.com/channel/new-channel');
    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'discovery-watchlist' }],
      [{ id: 'ops-channels', intent: { operationStage: 'scan' } }],
      [{ id: 'vault-videos' }],
      [{ id: 'tools-bookmarks' }],
      [{ id: 'vault-sources' }],
      [{ id: 'ops-channels', intent: { operationStage: 'add', source: 'youtube-channel-search' } }],
    ]);
  });
});
