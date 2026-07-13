const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildChannelWatchlistRouteProps({
  channelsLoading,
  loadChannelsFromCloud,
  loadStoredVideosForSelectedChannels,
  openCreatorView,
  savedChannels,
  selectedChannelIds,
  toggleChannelSelection,
} = {}) {
  return {
    channels: toArray(savedChannels),
    channelsLoading: Boolean(channelsLoading),
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenChannelList: () => openCreatorView({ id: 'ops-channels' }),
    onOpenSelectedScan: () => openCreatorView({ id: 'ops-selected-scan' }),
    onRefreshChannels: loadChannelsFromCloud,
    onToggleSelection: toggleChannelSelection,
    selectedChannelIds: toArray(selectedChannelIds),
  };
}
