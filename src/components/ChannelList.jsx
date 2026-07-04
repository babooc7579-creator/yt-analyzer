import { formatNumberedUrlList, getYouTubeChannelUrl } from '../utils/urls';
import ChannelListBody from './ChannelListBody';
import ChannelListUrlExportPanel from './ChannelListUrlExportPanel';

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
  const visibleChannels = channels.filter((channel) => channel.tags?.includes(selectedCategory));
  const visibleChannelUrlList = formatNumberedUrlList(
    visibleChannels.map((channel) => {
      const channelUrl = getYouTubeChannelUrl(channel);
      return channelUrl ? [channel.title || '제목 없는 채널', channelUrl] : null;
    })
  );

  return (
    <div className="space-y-3">
      {!channelsLoading && visibleChannels.length > 0 ? (
        <ChannelListUrlExportPanel
          selectedCategory={selectedCategory}
          visibleChannelUrlList={visibleChannelUrlList}
          visibleChannels={visibleChannels}
        />
      ) : null}

      <div className="space-y-3 max-h-[420px] xl:max-h-[520px] overflow-y-auto pr-1.5">
        <ChannelListBody
          channelsLoading={channelsLoading}
          getScanDisplay={getScanDisplay}
          onDelete={onDelete}
          onOpenNotes={onOpenNotes}
          onToggleSelection={onToggleSelection}
          onUpdateMetadata={onUpdateMetadata}
          selectedChannelIds={selectedChannelIds}
          updatingChannelId={updatingChannelId}
          visibleChannels={visibleChannels}
        />
      </div>
    </div>
  );
}
