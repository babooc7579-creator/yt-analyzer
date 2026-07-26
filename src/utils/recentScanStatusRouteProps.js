const focusChannel = (setSelectedChannelIds, channelId) => {
  if (!channelId || typeof setSelectedChannelIds !== 'function') return;
  setSelectedChannelIds([channelId]);
};

export const buildRecentScanStatusRouteProps = (props = {}) => ({
  channels: Array.isArray(props.savedChannels) ? props.savedChannels : [],
  channelsLoading: Boolean(props.channelsLoading),
  onBackfillChannel: props.runHistoricalBackfill,
  onOpenChannelOperations: (channelId) => {
    focusChannel(props.setSelectedChannelIds, channelId);
    return props.openCreatorView?.({
      id: 'ops-channels',
      intent: { operationStage: 'manage' },
    });
  },
  onOpenSelectedScan: (channelId) => {
    focusChannel(props.setSelectedChannelIds, channelId);
    return props.openCreatorView?.({
      id: 'ops-channels',
      intent: { operationStage: 'scan' },
    });
  },
});
