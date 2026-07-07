import { formatNumberedUrlList, getYouTubeChannelUrl } from './urls';

export const getChannelList = (channels) => (
  Array.isArray(channels) ? channels.filter(channel => channel && typeof channel === 'object') : []
);

export const hasChannelTag = (channel, tag) => (
  Array.isArray(channel?.tags) && channel.tags.includes(tag)
);

export const getVisibleChannels = (channels, selectedCategory) => (
  getChannelList(channels).filter((channel) => hasChannelTag(channel, selectedCategory))
);

export const getVisibleChannelUrlList = (visibleChannels) => (
  formatNumberedUrlList(
    getChannelList(visibleChannels).map((channel) => {
      const channelUrl = getYouTubeChannelUrl(channel);
      return channelUrl ? [channel.title || '제목 없는 채널', channelUrl] : null;
    })
  )
);

export const getChannelListExportPanelProps = ({
  selectedCategory,
  visibleChannelUrlList,
  visibleChannels,
}) => ({
  selectedCategory,
  visibleChannelUrlList,
  visibleChannels,
});

export const getChannelListBodyProps = ({
  channelList,
  channelsLoading,
  getScanDisplay,
  onDelete,
  onOpenNotes,
  onToggleSelection,
  onUpdateMetadata,
  selectedChannelIds,
  selectedCategory,
  updatingChannelId,
  visibleChannels,
}) => ({
  channelsLoading,
  getScanDisplay,
  onDelete,
  onOpenNotes,
  onToggleSelection,
  onUpdateMetadata,
  selectedChannelIds,
  selectedCategory,
  totalChannelCount: getChannelList(channelList).length,
  updatingChannelId,
  visibleChannels,
});
