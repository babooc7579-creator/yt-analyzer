import { Clock, MessageSquareText, Rocket, Star } from 'lucide-react';
import { getLanguageLabel } from '../constants/languages';
import { hasStrongReaction, isTtoTtoCandidate, TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from '../utils/video';
import CopyUrlButton from './CopyUrlButton';
import { getYouTubeVideoUrl } from '../utils/urls';
import VideoCardCandidateReasons from './VideoCardCandidateReasons';
import VideoCardStatsGrid from './VideoCardStatsGrid';
import VideoCardThumbnail from './VideoCardThumbnail';

export default function VideoCard({
  video,
  rank,
  isChecked,
  isSaved,
  isProductionCandidate,
  showWorkPanel,
  onToggleCheck,
  onToggleScrap,
  onPromoteToProduction,
  onFetchComments,
}) {
  const videoTitle = video.title || '제목 없는 영상';
  const isStrongReaction = hasStrongReaction(video);
  const isCandidate = isStrongReaction || isTtoTtoCandidate(video);
  const thumbnailHeightClass = showWorkPanel ? 'min-h-[360px]' : 'min-h-[420px]';
  const videoUrl = getYouTubeVideoUrl(video.videoId);
  const candidateReasons = [
    video.multiplier >= TTOTTO_MIN_MULTIPLIER ? `평균 대비 ${video.multiplier.toFixed(1)}배` : null,
    video.daysOld >= TTOTTO_MIN_DAYS_OLD ? `${video.daysOld}일 지난 소재` : null,
    isStrongReaction ? '강한 참여 반응' : null,
  ].filter(Boolean);

  return (
    <div className={`group overflow-hidden rounded-lg border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isChecked ? 'border-indigo-300 bg-indigo-50' : isCandidate ? 'border-rose-100 bg-white' : 'border-slate-200 bg-white'}`}>
      <VideoCardThumbnail
        isCandidate={isCandidate}
        isChecked={isChecked}
        isSaved={isSaved}
        isStrongReaction={isStrongReaction}
        onToggleCheck={onToggleCheck}
        onToggleScrap={onToggleScrap}
        rank={rank}
        thumbnailHeightClass={thumbnailHeightClass}
        video={video}
        videoTitle={videoTitle}
      />
      <div className={`${showWorkPanel ? 'p-5' : 'p-4'}`}>
        <a href={videoUrl} target="_blank" rel="noreferrer" className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 hover:text-indigo-600" title={videoTitle} aria-label={`${videoTitle} YouTube 원본 영상 열기`}>{videoTitle}</a>
        <VideoCardCandidateReasons candidateReasons={candidateReasons} />
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {isSaved && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold text-yellow-700">소재 보관됨</span>}
          {isProductionCandidate && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">제작 후보</span>}
          {isChecked && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">AI 리메이크 선택</span>}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600">{getLanguageLabel(video.language) || '언어 미상'}</span>
          {video.isShorts ? (
            <span className="rounded-full bg-pink-100 px-2 py-1 text-[11px] font-bold text-pink-700">Shorts ({video.duration})</span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600"><Clock className="w-3 h-3" /> {video.duration}</span>
          )}
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

        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => onToggleScrap(video)}
            title={isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}
            aria-label={`${videoTitle} ${isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isSaved ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
          >
            <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-yellow-800' : ''}`} />
            {isSaved ? '보관 해제' : '소재 보관'}
          </button>
          <button
            type="button"
            onClick={() => onPromoteToProduction(video)}
            disabled={isProductionCandidate}
            title={isProductionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 저장됨' : 'Cloud 판단 기록에 제작 후보로 저장합니다. YouTube API를 새로 호출하지 않습니다.'}
            aria-label={`${videoTitle} ${isProductionCandidate ? '이미 Cloud 판단 기록에 제작 후보로 저장됨' : 'Cloud 판단 기록에 제작 후보로 저장, YouTube API 호출 없음'}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isProductionCandidate ? 'cursor-not-allowed bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            <Rocket className="h-3.5 w-3.5" />
            {isProductionCandidate ? '제작 후보 등록됨' : '제작 후보로'}
          </button>
        </div>

        <VideoCardStatsGrid isStrongReaction={isStrongReaction} showWorkPanel={showWorkPanel} video={video} />
      </div>
    </div>
  );
}
