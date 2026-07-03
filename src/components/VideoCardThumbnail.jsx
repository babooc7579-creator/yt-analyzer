import { CheckSquare, Rocket, Square, Star, TrendingUp } from 'lucide-react';

export default function VideoCardThumbnail({
  isCandidate,
  isChecked,
  isSaved,
  isStrongReaction,
  onToggleCheck,
  onToggleScrap,
  rank,
  thumbnailHeightClass,
  video,
  videoTitle,
}) {
  return (
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
  );
}
