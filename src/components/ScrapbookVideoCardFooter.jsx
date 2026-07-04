import { MessageSquareText, Trash2 } from 'lucide-react';

import CopyUrlButton from './CopyUrlButton';
import ScrapbookVideoFooterStats from './ScrapbookVideoFooterStats';

export default function ScrapbookVideoCardFooter({
  onFetchComments,
  onRemoveScrap,
  video,
  videoTitle,
  videoUrl,
}) {
  const confirmRemoveScrap = () => {
    const confirmed = window.confirm(
      `'${videoTitle}' 영상을 Cloud 스크랩북에서 해제할까요?\n\n영상 원본이나 저장된 영상 데이터는 삭제되지 않고, 스크랩북 보관 표시만 해제됩니다.`
    );

    if (confirmed) onRemoveScrap(video);
  };

  return (
    <div className="flex justify-between items-end pt-3 border-t border-slate-100">
      <ScrapbookVideoFooterStats video={video} />
      <div className="flex gap-2">
        <CopyUrlButton
          url={videoUrl}
          label="URL 복사"
          copiedLabel="복사 완료"
          ariaLabel={`${videoTitle} YouTube 원본 URL 복사`}
          title="YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
          className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] font-bold text-slate-600 transition-colors hover:bg-slate-100 disabled:text-slate-300"
        />
        <button
          onClick={() => onFetchComments(video.videoId, video.title)}
          className="p-1.5 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
          title="댓글 Top 10 보기 - YouTube API로 댓글을 조회합니다"
          aria-label={`${videoTitle} 댓글 Top 10 보기 - YouTube API로 댓글 조회`}
          type="button"
        >
          <MessageSquareText className="w-4 h-4" />
        </button>
        <button
          onClick={confirmRemoveScrap}
          className="p-1.5 text-slate-400 bg-slate-50 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Cloud 스크랩북에서 해제"
          aria-label={`${videoTitle} Cloud 스크랩북에서 해제`}
          type="button"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
