const focusChannel = ({
  channels,
  channelId,
  setSelectedCategoryTab,
  setSelectedChannelIds,
}) => {
  if (!channelId || typeof setSelectedChannelIds !== 'function') return;

  const channel = channels.find((item) => item?.id === channelId);
  const firstTag = Array.isArray(channel?.tags) ? channel.tags[0] : '';
  if (firstTag && typeof setSelectedCategoryTab === 'function') {
    setSelectedCategoryTab(firstTag);
  }
  setSelectedChannelIds([channelId]);
};

export const buildRecentScanStatusRouteProps = (props = {}) => {
  const channels = Array.isArray(props.savedChannels) ? props.savedChannels : [];
  const focusRequestedChannel = (channelId) => focusChannel({
    channels,
    channelId,
    setSelectedCategoryTab: props.setSelectedCategoryTab,
    setSelectedChannelIds: props.setSelectedChannelIds,
  });

  return {
    channels,
    channelsLoading: Boolean(props.channelsLoading),
    onBackfillChannel: props.runHistoricalBackfill,
    onOpenChannelOperations: (channelId) => {
      focusRequestedChannel(channelId);
      return props.openCreatorView?.({
        id: 'ops-channels',
        intent: { operationStage: 'manage' },
      });
    },
    onOpenSelectedScan: (channelId) => {
      focusRequestedChannel(channelId);
      return props.openCreatorView?.({
        id: 'ops-channels',
        intent: { operationStage: 'scan' },
      });
    },
  };
};
