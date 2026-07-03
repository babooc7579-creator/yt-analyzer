import { Clock, MessageSquareText } from 'lucide-react';
import { LANGUAGES } from '../constants/languages';
import CopyUrlButton from './CopyUrlButton';
import VideoListRowBadges from './VideoListRowBadges';

export default function VideoListRowContentCell({
  fetchTopComments,
  isChecked,
  isProductionCandidate,
  isSaved,
  isStrongReaction,
  isTtoTto,
  video,
  videoTitle,
  videoUrl,
}) {
  return (
    <td className="px-4 py-5 min-w-[520px]">
      <div className="flex gap-5">
        <img src={video.thumbnail} alt={`${videoTitle} 썸네일`} className="w-36 h-20 object-cover rounded-xl shadow-sm border border-slate-200 shrink-0 bg-slate-100" />
        <div className="flex flex-col justify-center min-w-0">
          <VideoListRowBadges
            isChecked={isChecked}
            isProductionCandidate={isProductionCandidate}
            isSaved={isSaved}
            isStrongReaction={isStrongReaction}
            isTtoTto={isTtoTto}
          />
          <a
            href={videoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-base font-extrabold text-slate-900 hover:text-indigo-600 line-clamp-2 leading-snug mb-2"
            title={videoTitle}
            aria-label={`${videoTitle} YouTube 원본 영상 열기`}
          >
            {videoTitle}
          </a>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200 font-semibold">
              {LANGUAGES.find((language) => language.code === video.language)?.label || '언어 미상'}
            </span>
            {video.isShorts ? (
              <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-bold">Shorts ({video.duration})</span>
            ) : (
              <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> {video.duration}</span>
            )}
            <button
              type="button"
              onClick={() => fetchTopComments(video.videoId, video.title)}
              title="YouTube API로 댓글 Top 10을 조회합니다"
              aria-label={`${videoTitle} 댓글 Top 10 조회 - YouTube API 호출`}
              className="text-[11px] bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-full font-bold border border-indigo-100 flex items-center gap-1 transition-colors"
            >
              <MessageSquareText className="w-3 h-3" /> 댓글 Top 10 보기
            </button>
            <CopyUrlButton
              url={videoUrl}
              label="URL 복사"
              copiedLabel="복사 완료"
              ariaLabel={`${videoTitle} YouTube 원본 URL 복사`}
              title="YouTube 원본 URL을 클립보드에 복사합니다. YouTube API 호출이나 저장 작업은 없습니다."
              className="text-[11px] bg-slate-50 text-slate-600 hover:bg-slate-100 px-2 py-1 rounded-full font-bold border border-slate-200 flex items-center gap-1 transition-colors disabled:text-slate-300"
            />
          </div>
        </div>
      </div>
    </td>
  );
}
