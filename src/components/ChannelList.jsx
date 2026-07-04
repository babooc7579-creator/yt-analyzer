import { FolderOpen, Loader2 } from 'lucide-react';
import { formatNumberedUrlList, getYouTubeChannelUrl } from '../utils/urls';
import ChannelListUrlExportPanel from './ChannelListUrlExportPanel';
import ChannelListItem from './ChannelListItem';

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
      {channelsLoading ? (
        <p className="text-sm text-slate-400 text-center py-4 flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> 클라우드에서 채널 불러오는 중...</p>
      ) : visibleChannels.length === 0 ? (
        <div className="text-center py-5 px-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <FolderOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">저장된 채널이 없습니다.</p>
          <p className="text-[11px] text-slate-500 mt-1">먼저 위에서 채널을 미리보기한 뒤 저장해 주세요.</p>
        </div>
      ) : (
        visibleChannels.map((channel) => (
          <ChannelListItem
            key={channel.id}
            channel={channel}
            isSelected={selectedChannelIds.includes(channel.id)}
            scanDisplay={getScanDisplay(channel)}
            onToggleSelection={onToggleSelection}
            onOpenNotes={onOpenNotes}
            onUpdateMetadata={onUpdateMetadata}
            isUpdating={updatingChannelId === channel.id}
            onDelete={onDelete}
          />
        ))
      )}
      </div>
    </div>
  );
}
