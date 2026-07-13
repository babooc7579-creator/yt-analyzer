import { describe, expect, it, vi } from 'vitest';

import { buildChannelWatchlistRouteProps } from './channelWatchlistRouteProps';

describe('channelWatchlistRouteProps utils', () => {
  it('connects selection, stored lookup, refresh, and navigation without running them', () => {
    const openCreatorView = vi.fn();
    const onLoad = vi.fn();
    const onRefresh = vi.fn();
    const onToggle = vi.fn();
    const props = buildChannelWatchlistRouteProps({
      channelsLoading: true,
      loadChannelsFromCloud: onRefresh,
      loadStoredVideosForSelectedChannels: onLoad,
      openCreatorView,
      savedChannels: [{ id: 'channel-1' }],
      selectedChannelIds: ['channel-1'],
      toggleChannelSelection: onToggle,
    });

    expect(props).toMatchObject({
      channels: [{ id: 'channel-1' }],
      channelsLoading: true,
      onLoadStoredVideos: onLoad,
      onRefreshChannels: onRefresh,
      onToggleSelection: onToggle,
      selectedChannelIds: ['channel-1'],
    });
    expect(openCreatorView).not.toHaveBeenCalled();

    props.onOpenChannelList();
    props.onOpenSelectedScan();

    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'ops-channels' }],
      [{ id: 'ops-selected-scan' }],
    ]);
  });
});
