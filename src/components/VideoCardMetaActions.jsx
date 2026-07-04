import { MessageSquareText } from 'lucide-react';

import CopyUrlButton from './CopyUrlButton';
import VideoCardMetaBadges from './VideoCardMetaBadges';

export default function VideoCardMetaActions({
  onFetchComments,
  video,
  videoTitle,
  videoUrl,
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <VideoCardMetaBadges video={video} />
      <button
        type="button"
        onClick={() => onFetchComments(video.videoId, video.title)}
        title="YouTube API로 댓글 Top 10을 조회합니다"
        aria-label={`${videoTitle} 댓글 Top 10 조회 - YouTube API 호출`}
        className="flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
      >
        <MessageSquareText className="w-3 h-3" /> 댓글 Top 10 보기
      </button>
      <CopyUrlButton
        url={videoUrl}
        label="URL 복사"
        copiedLabel="복사 완료"
        ariaLabel={`${videoTitle} YouTube 원본 URL 복사`}
        title="YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
        className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100 disabled:text-slate-300"
      />
    </div>
  );
}
