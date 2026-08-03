const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildKeywordExplorerRouteProps({
  addDiscoveryLink,
  checkedVideos,
  discoveryLinks,
  discoveryLinksSaving,
  fetchTopComments,
  isProductionCandidate,
  isVideoSaved,
  loadStoredVideosForSelectedChannels,
  loading,
  openCreatorView,
  promoteVideoToProduction,
  savedChannels,
  setAddMode,
  setBulkInput,
  setBulkResult,
  setChannelPreview,
  setNewChannelInput,
  selectedChannelIds,
  toggleCheckVideo,
  toggleScrapVideo,
  videos,
} = {}) {
  const normalizedSelectedChannelIds = toArray(selectedChannelIds);

  return {
    checkedVideos: toArray(checkedVideos),
    discoveryLinks: toArray(discoveryLinks),
    discoveryLinksSaving: Boolean(discoveryLinksSaving),
    isProductionCandidate,
    isVideoSaved,
    loading: Boolean(loading),
    onFetchComments: fetchTopComments,
    onLoadStoredVideos: loadStoredVideosForSelectedChannels,
    onOpenDiscoveryLinks: () => openCreatorView({ id: 'vault-sources' }),
    onOpenChannelWatchlist: () => openCreatorView({ id: 'discovery-watchlist' }),
    onOpenSelectedScan: () => openCreatorView({
      id: 'ops-channels',
      intent: { operationStage: 'scan' },
    }),
    onOpenWorkTools: () => openCreatorView({ id: 'tools-bookmarks' }),
    onOpenVault: () => openCreatorView({ id: 'vault-videos' }),
    onPrepareChannelRegistration: (channel = {}) => {
      const channelInput = String(channel.url || channel.channelId || '').trim();
      if (!channelInput) return;
      const registrationSource = channel.registrationSource === 'youtube-video-search'
        ? 'youtube-video-search'
        : 'youtube-channel-search';
      setAddMode?.('single');
      setChannelPreview?.(null);
      setNewChannelInput?.(channelInput);
      openCreatorView({ id: 'ops-channels', intent: { operationStage: 'add', source: registrationSource } });
    },
    onPrepareBulkChannelRegistration: (channels = []) => {
      const channelInputs = [...new Set(toArray(channels).map((channel) => (
        String(channel?.url || channel?.channelId || '').trim()
      )).filter(Boolean))].slice(0, 50);
      if (channelInputs.length === 0) return;
      setAddMode?.('bulk');
      setChannelPreview?.(null);
      setBulkResult?.(null);
      setBulkInput?.(channelInputs.join('\n'));
      openCreatorView({ id: 'ops-channels', intent: { operationStage: 'add', source: 'youtube-channel-search-bulk' } });
    },
    onPromoteToProduction: promoteVideoToProduction,
    onSaveDiscoveryLink: addDiscoveryLink,
    onToggleCheck: toggleCheckVideo,
    onToggleScrap: toggleScrapVideo,
    selectedChannelCount: normalizedSelectedChannelIds.length,
    selectedChannelKey: [...normalizedSelectedChannelIds].sort().join('|'),
    registeredChannelIds: toArray(savedChannels).map((channel) => String(channel?.id || '')).filter(Boolean),
    videos: toArray(videos),
  };
}
