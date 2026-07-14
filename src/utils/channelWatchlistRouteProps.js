const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildChannelWatchlistRouteProps({
  channelsLoading,
  loadChannelsFromCloud,
  loadStoredVideosForSelectedChannels,
  openCreatorView,
  savedChannels,
  selectedChannelIds,
  setSelectedChannelIds,
  toggleChannelSelection,
} = {}) {
  const loadStoredVideosAndOpenRadar = async () => {
    const result = await loadStoredVideosForSelectedChannels();
    if (result?.success) openCreatorView({ id: 'home' });
    return result;
  };

  return {
    channels: toArray(savedChannels),
    channelsLoading: Boolean(channelsLoading),
    onLoadStoredVideos: loadStoredVideosAndOpenRadar,
    onOpenChannelList: () => openCreatorView({ id: 'ops-channels' }),
    onOpenStoredVideos: () => openCreatorView({ id: 'vault-videos' }),
    onOpenSelectedScan: () => openCreatorView({ id: 'ops-selected-scan' }),
    onOpenTtoTto: () => openCreatorView({ id: 'discovery-ttotto' }),
    onRefreshChannels: loadChannelsFromCloud,
    onSetSelectedChannelIds: setSelectedChannelIds,
    onToggleSelection: toggleChannelSelection,
    selectedChannelIds: toArray(selectedChannelIds),
  };
}
