const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildChannelWatchlistRouteProps({
  channelsLoading,
  loadChannelsFromCloud,
  loadStoredVideosForSelectedChannels,
  openCreatorView,
  savedChannels,
  selectedChannelIds,
  setSelectedChannelIds,
  storedVideoLoadResult,
  toggleChannelSelection,
} = {}) {
  return {
    channels: toArray(savedChannels),
    channelsLoading: Boolean(channelsLoading),
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenChannelList: () => openCreatorView({ id: 'ops-channels' }),
    onOpenRadar: () => openCreatorView({ id: 'home' }),
    onOpenStoredVideos: () => openCreatorView({ id: 'vault-videos' }),
    onOpenSelectedScan: () => openCreatorView({ id: 'ops-channels', intent: { operationStage: 'scan' } }),
    onOpenTtoTto: () => openCreatorView({ id: 'discovery-ttotto' }),
    onRefreshChannels: loadChannelsFromCloud,
    onSetSelectedChannelIds: setSelectedChannelIds,
    onToggleSelection: toggleChannelSelection,
    selectedChannelIds: toArray(selectedChannelIds),
    storedVideoLoadResult,
  };
}
