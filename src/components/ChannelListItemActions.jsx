import { History, Trash2 } from 'lucide-react';

import { getYouTubeChannelUrl } from '../utils/urls';
import CopyUrlButton from './CopyUrlButton';

export default function ChannelListItemActions({
  channel,
  onDelete,
  onOpenNotes,
}) {
  const channelUrl = getYouTubeChannelUrl(channel);

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenNotes(channel)}
        className="relative p-1 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-1"
        title="분석/기록 남기기"
        aria-label={`${channel.title} 분석/기록 남기기`}
      >
        <History className="w-4 h-4" />
        {channel.notes?.length > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{channel.notes.length}</span>}
      </button>
      <CopyUrlButton
        url={channelUrl}
        label="채널 URL 복사"
        copiedLabel="복사됨"
        ariaLabel={`${channel.title} YouTube 채널 URL 복사`}
        title="YouTube 채널 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
        showLabel={false}
        className="inline-flex items-center justify-center p-1 text-slate-400 hover:text-blue-600 transition-colors shrink-0 mt-1 disabled:text-slate-200"
        iconClassName="w-4 h-4"
      />
      <button
        onClick={() => onDelete(channel.id, channel.category, channel.title)}
        className="p-1 text-slate-400 hover:text-red-500 transition-colors shrink-0 mt-1"
        title="Cloud 채널 목록에서 삭제합니다. 저장 영상 조회와 새 영상 수집 대상에서 빠집니다."
        aria-label={`${channel.title} Cloud 채널 목록에서 삭제하고 조회/수집 대상에서 제외`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  );
}
