import { describe, expect, it, vi } from 'vitest';

import { buildKeywordExplorerRouteProps } from './keywordExplorerRouteProps';

describe('keywordExplorerRouteProps', () => {
  it('connects stored-video actions without invoking them while building props', () => {
    const openCreatorView = vi.fn();
    const setAddMode = vi.fn();
    const setBulkInput = vi.fn();
    const setBulkResult = vi.fn();
    const setChannelPreview = vi.fn();
    const setNewChannelInput = vi.fn();
    const props = buildKeywordExplorerRouteProps({
      addDiscoveryLink: vi.fn(),
      checkedVideos: ['v1'],
      discoveryLinks: [{ id: 'link-1' }],
      discoveryLinksError: '조회 실패',
      discoveryLinksLoading: true,
      discoveryLinksSaving: true,
      loadDiscoveryLinks: vi.fn(),
      loading: true,
      openCreatorView,
      selectedChannelIds: ['c1', 'c2'],
      savedChannels: [{ id: 'registered-1' }],
      setAddMode,
      setBulkInput,
      setBulkResult,
      setChannelPreview,
      setNewChannelInput,
      videos: [{ videoId: 'v1' }],
    });

    expect(props).toMatchObject({
      checkedVideos: ['v1'],
      discoveryLinks: [{ id: 'link-1' }],
      discoveryLinksError: '조회 실패',
      discoveryLinksLoading: true,
      discoveryLinksSaving: true,
      loading: true,
      selectedChannelCount: 2,
      selectedChannelKey: 'c1|c2',
      registeredChannelIds: ['registered-1'],
      videos: [{ videoId: 'v1' }],
    });
    expect(openCreatorView).not.toHaveBeenCalled();
    expect(props.onReloadDiscoveryLinks).toBeTypeOf('function');

    props.onOpenChannelWatchlist();
    props.onOpenTtoTto();
    props.onOpenSelectedScan();
    props.onOpenVault();
    props.onOpenWorkTools();
    props.onOpenDiscoveryLinks();
    props.onPrepareChannelRegistration({
      channelId: 'new-channel',
      registrationSource: 'youtube-video-search',
      url: 'https://www.youtube.com/channel/new-channel',
    });
    props.onPrepareBulkChannelRegistration([
      { channelId: 'bulk-1', registrationSource: 'youtube-video-search', url: 'https://www.youtube.com/channel/bulk-1' },
      { channelId: 'bulk-2' },
    ]);
    expect(setAddMode).toHaveBeenCalledWith('single');
    expect(setChannelPreview).toHaveBeenCalledWith(null);
    expect(setNewChannelInput).toHaveBeenCalledWith('https://www.youtube.com/channel/new-channel');
    expect(setAddMode).toHaveBeenLastCalledWith('bulk');
    expect(setBulkResult).toHaveBeenCalledWith(null);
    expect(setBulkInput).toHaveBeenCalledWith('https://www.youtube.com/channel/bulk-1\nbulk-2');
    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'discovery-watchlist' }],
      [{ id: 'discovery-ttotto' }],
      [{ id: 'ops-channels', intent: { operationStage: 'scan' } }],
      [{ id: 'vault-videos' }],
      [{ id: 'tools-bookmarks' }],
      [{ id: 'vault-sources' }],
      [{ id: 'ops-channels', intent: { operationStage: 'add', source: 'youtube-video-search' } }],
      [{ id: 'ops-channels', intent: { operationStage: 'add', source: 'youtube-video-search-bulk' } }],
    ]);
  });

  it('uses the channel-search source for a direct channel result', () => {
    const openCreatorView = vi.fn();
    const props = buildKeywordExplorerRouteProps({
      openCreatorView,
      setNewChannelInput: vi.fn(),
    });

    props.onPrepareChannelRegistration({ channelId: 'channel-result' });

    expect(openCreatorView).toHaveBeenCalledWith({
      id: 'ops-channels',
      intent: { operationStage: 'add', source: 'youtube-channel-search' },
    });
  });

  it('prepares duplicate source channels only once for bulk registration review', () => {
    const setBulkInput = vi.fn();
    const props = buildKeywordExplorerRouteProps({
      openCreatorView: vi.fn(),
      setBulkInput,
    });

    props.onPrepareBulkChannelRegistration([
      { channelId: 'same-channel' },
      { channelId: 'same-channel' },
      { url: 'https://www.youtube.com/channel/unique-channel' },
    ]);

    expect(setBulkInput).toHaveBeenCalledWith('same-channel\nhttps://www.youtube.com/channel/unique-channel');
  });
});
