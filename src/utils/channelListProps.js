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

export const getChannelListBodyVisibleChannels = (visibleChannels) => (
  Array.isArray(visibleChannels) ? visibleChannels : []
);

export const getChannelListItemsProps = ({
  getScanDisplay,
  onDelete,
  onOpenNotes,
  onToggleSelection,
  onUpdateMetadata,
  selectedChannelIds,
  updatingChannelId,
  visibleChannels,
}) => ({
  getScanDisplay,
  onDelete,
  onOpenNotes,
  onToggleSelection,
  onUpdateMetadata,
  selectedChannelIds,
  updatingChannelId,
  visibleChannels,
});

export const getChannelListEmptyStateViewProps = ({
  selectedCategory,
  totalChannelCount = 0,
} = {}) => {
  const hasChannelsInOtherTags = totalChannelCount > 0;

  return {
    description: hasChannelsInOtherTags
      ? '다른 태그에는 저장된 채널이 있습니다. 이 태그로 보려면 채널 태그를 추가하거나 다른 태그를 선택해 주세요.'
      : '먼저 위에서 채널을 미리보기한 뒤 Cloud 채널 목록에 저장해 주세요. 채널 저장만으로 새 영상 수집은 실행되지 않습니다.',
    hasChannelsInOtherTags,
    title: hasChannelsInOtherTags
      ? `${selectedCategory} 태그에 채널이 없습니다.`
      : '저장된 채널이 없습니다.',
  };
};
