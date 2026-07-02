import { CheckSquare, Clock, MessageSquareText, Rocket, Square, Star, TrendingUp } from 'lucide-react';
import { getLanguageLabel } from '../constants/languages';
import { hasStrongReaction, isTtoTtoCandidate, TTOTTO_MIN_DAYS_OLD, TTOTTO_MIN_MULTIPLIER } from '../utils/video';

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
  const candidateReasons = [
    video.multiplier >= TTOTTO_MIN_MULTIPLIER ? `평균 대비 ${video.multiplier.toFixed(1)}배` : null,
    video.daysOld >= TTOTTO_MIN_DAYS_OLD ? `${video.daysOld}일 지난 소재` : null,
    isStrongReaction ? '강한 참여 반응' : null,
  ].filter(Boolean);

  return (
    <div className={`group overflow-hidden rounded-lg border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${isChecked ? 'border-indigo-300 bg-indigo-50' : isCandidate ? 'border-rose-100 bg-white' : 'border-slate-200 bg-white'}`}>
      <div className={`relative overflow-hidden bg-slate-100 ${thumbnailHeightClass}`}>
        <img src={video.thumbnail} alt={`${videoTitle} 썸네일`} className={`h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] ${thumbnailHeightClass}`} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/75 px-2.5 py-1 text-xs font-extrabold text-white">#{rank}</span>
          {isCandidate && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-extrabold text-white shadow-sm">
              <Rocket className="w-3 h-3" /> 또터또 후보
            </span>
          )}
          {isStrongReaction && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
              <TrendingUp className="w-3 h-3" /> 강한 반응
            </span>
          )}
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => onToggleCheck(video.videoId)}
            title="AI 리메이크 요청문에 포함할 영상으로 선택"
            aria-label={`${videoTitle} AI 리메이크 요청문 선택 ${isChecked ? '해제' : '추가'}`}
            className="rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-indigo-50"
          >
            {isChecked ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-400 hover:text-indigo-500" />}
          </button>
          <button
            type="button"
            onClick={() => onToggleScrap(video)}
            title={isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}
            aria-label={`${videoTitle} ${isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}`}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold shadow-sm transition-colors ${isSaved ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-300' : 'bg-white/90 text-slate-600 hover:bg-yellow-50 hover:text-yellow-700'}`}
          >
            <Star className={`w-4 h-4 ${isSaved ? 'fill-yellow-950 text-yellow-950' : 'text-slate-400 group-hover:text-yellow-500'}`} />
            {isSaved ? '보관됨' : '소재 보관'}
          </button>
        </div>
      </div>
      <div className={`${showWorkPanel ? 'p-5' : 'p-4'}`}>
        <a href={`https://youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noreferrer" className="line-clamp-2 text-base font-extrabold leading-snug text-slate-900 hover:text-indigo-600" title={videoTitle}>{videoTitle}</a>
        {candidateReasons.length > 0 && (
          <div className="mt-3 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2">
            <p className="text-[10px] font-extrabold text-rose-500">후보 이유</p>
            <p className="mt-0.5 text-xs font-bold text-rose-800">{candidateReasons.join(' · ')}</p>
          </div>
        )}
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
            title={isProductionCandidate ? '이미 제작 후보로 저장됨' : '제작 후보 상태로 저장'}
            aria-label={`${videoTitle} ${isProductionCandidate ? '이미 제작 후보로 저장됨' : '제작 후보로 저장'}`}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isProductionCandidate ? 'cursor-not-allowed bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
          >
            <Rocket className="h-3.5 w-3.5" />
            {isProductionCandidate ? '제작 후보 등록됨' : '제작 후보로'}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className={`${showWorkPanel ? 'p-3' : 'p-2.5'} rounded-lg border border-slate-200 bg-slate-50`}>
            <p className="text-[10px] font-bold text-slate-400">총 조회수</p>
            <p className="text-sm font-extrabold text-slate-800">{video.view_count.toLocaleString()}</p>
          </div>
          <div className={`${showWorkPanel ? 'p-3' : 'p-2.5'} rounded-lg border ${isStrongReaction ? 'border-rose-500 bg-rose-600 text-white' : video.multiplier >= TTOTTO_MIN_MULTIPLIER ? 'border-indigo-100 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
            <p className={`text-[10px] font-bold ${isStrongReaction ? 'text-rose-100' : 'text-slate-400'}`}>대박 지수</p>
            <p className="text-sm font-extrabold">{video.multiplier.toFixed(1)}x</p>
          </div>
          <div className={`${showWorkPanel ? 'p-3' : 'p-2.5'} rounded-lg border border-slate-200 bg-slate-50`}>
            <p className="text-[10px] font-bold text-slate-400">참여율</p>
            <p className={`text-sm font-extrabold ${video.like_ratio >= 3 ? 'text-rose-600' : 'text-slate-800'}`}>{video.like_ratio}% <span className="text-[10px] font-medium text-slate-400">좋아요 {video.like_count.toLocaleString()}</span></p>
          </div>
          <div className={`${showWorkPanel ? 'p-3' : 'p-2.5'} rounded-lg border ${video.daysOld >= TTOTTO_MIN_DAYS_OLD ? 'border-orange-100 bg-orange-50 text-orange-700' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
            <p className="text-[10px] font-bold text-slate-400">경과일</p>
            <p className="text-sm font-extrabold">{video.daysOld}일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
