import { describe, expect, it, vi } from 'vitest';

import { buildChannelWatchlistRouteProps } from './channelWatchlistRouteProps';

describe('channelWatchlistRouteProps utils', () => {
  it('connects selection, stored lookup, refresh, and navigation without running them', async () => {
    const openCreatorView = vi.fn();
    const onLoad = vi.fn().mockResolvedValue({ success: true, videoCount: 3 });
    const onRefresh = vi.fn();
    const onSetSelected = vi.fn();
    const onToggle = vi.fn();
    const props = buildChannelWatchlistRouteProps({
      channelsLoading: true,
      loadChannelsFromCloud: onRefresh,
      loadStoredVideosForSelectedChannels: onLoad,
      openCreatorView,
      savedChannels: [{ id: 'channel-1' }],
      selectedChannelIds: ['channel-1'],
      setSelectedChannelIds: onSetSelected,
      toggleChannelSelection: onToggle,
    });

    expect(props).toMatchObject({
      channels: [{ id: 'channel-1' }],
      channelsLoading: true,
      onRefreshChannels: onRefresh,
      onSetSelectedChannelIds: onSetSelected,
      onToggleSelection: onToggle,
      selectedChannelIds: ['channel-1'],
    });
    expect(openCreatorView).not.toHaveBeenCalled();

    await props.onLoadStoredVideos();
    props.onOpenChannelList();
    props.onOpenStoredVideos();
    props.onOpenSelectedScan();
    props.onOpenTtoTto();

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'home' }],
      [{ id: 'ops-channels' }],
      [{ id: 'vault-videos' }],
      [{ id: 'ops-selected-scan' }],
      [{ id: 'discovery-ttotto' }],
    ]);
  });

  it('stays on the channel screen when stored video lookup fails', async () => {
    const openCreatorView = vi.fn();
    const onLoad = vi.fn().mockResolvedValue({ success: false, videoCount: 0 });
    const props = buildChannelWatchlistRouteProps({
      loadStoredVideosForSelectedChannels: onLoad,
      openCreatorView,
    });

    await props.onLoadStoredVideos();

    expect(onLoad).toHaveBeenCalledTimes(1);
    expect(openCreatorView).not.toHaveBeenCalled();
  });
});
