import { formatNumberedUrlList, getYouTubeChannelUrl } from '../utils/urls';
import ChannelListBody from './ChannelListBody';
import ChannelListUrlExportPanel from './ChannelListUrlExportPanel';

const getChannelList = (channels) => (
  Array.isArray(channels) ? channels.filter(channel => channel && typeof channel === 'object') : []
);

const hasChannelTag = (channel, tag) => (
  Array.isArray(channel?.tags) && channel.tags.includes(tag)
);

export default function ChannelList({
  channels,
  selectedCategory,
  selectedChannelIds,
  channelsLoading,
  getScanDisplay,
  onToggleSelection,
  onOpenNotes,
  onUpdateMetadata,
  updatingChannelId,
  onDelete,
}) {
  const channelList = getChannelList(channels);
  const visibleChannels = channelList.filter((channel) => hasChannelTag(channel, selectedCategory));
  const visibleChannelUrlList = formatNumberedUrlList(
    visibleChannels.map((channel) => {
      const channelUrl = getYouTubeChannelUrl(channel);
      return channelUrl ? [channel.title || '제목 없는 채널', channelUrl] : null;
    })
  );

  const exportPanelProps = {
    selectedCategory,
    visibleChannelUrlList,
    visibleChannels,
  };

  const bodyProps = {
    channelsLoading,
    getScanDisplay,
    onDelete,
    onOpenNotes,
    onToggleSelection,
    onUpdateMetadata,
    selectedChannelIds,
    selectedCategory,
    totalChannelCount: channelList.length,
    updatingChannelId,
    visibleChannels,
  };

  return (
    <div className="space-y-3">
      {!channelsLoading && visibleChannels.length > 0 ? (
        <ChannelListUrlExportPanel {...exportPanelProps} />
      ) : null}

      <div className="space-y-3 max-h-[420px] xl:max-h-[520px] overflow-y-auto pr-1.5">
        <ChannelListBody {...bodyProps} />
      </div>
    </div>
  );
}
