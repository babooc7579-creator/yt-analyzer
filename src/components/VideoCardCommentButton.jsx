import { MessageSquareText } from 'lucide-react';

export default function VideoCardCommentButton({ onFetchComments, video, videoTitle }) {
  return (
    <button
      type="button"
      onClick={() => onFetchComments(video.videoId, video.title)}
      title="YouTube API로 댓글 Top 10을 조회합니다. 저장 영상 불러오기와 다른 작업입니다."
      aria-label={`${videoTitle} 댓글 Top 10 조회 - YouTube API 호출`}
      className="flex items-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-600 transition-colors hover:bg-indigo-100"
    >
      <MessageSquareText className="w-3 h-3" /> 댓글 Top 10(API)
    </button>
  );
}
