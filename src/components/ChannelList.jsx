import { FolderOpen, Loader2 } from 'lucide-react';
import CopyUrlButton from './CopyUrlButton';
import { formatNumberedUrlList, getYouTubeChannelUrl } from '../utils/urls';
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
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-extrabold text-slate-700">현재 목록 {visibleChannels.length}개</p>
              <p className="mt-0.5 text-[10px] leading-snug text-slate-500">
                화면에 보이는 채널명과 YouTube URL만 복사합니다. 저장이나 수집은 실행하지 않습니다.
              </p>
            </div>
            <CopyUrlButton
              url={visibleChannelUrlList}
              label="채널 URL 목록 복사"
              copiedLabel="목록 복사 완료"
              disabled={!visibleChannelUrlList}
              ariaLabel={`${selectedCategory} 채널 ${visibleChannels.length}개 URL 목록 복사`}
              title="현재 카테고리에 보이는 채널명과 YouTube URL 목록을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] font-extrabold text-slate-700 transition-colors hover:bg-slate-100 disabled:text-slate-300"
              iconClassName="h-3.5 w-3.5"
            />
          </div>
        </div>
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
