import { Star } from 'lucide-react';

export default function RadarCandidateScrapButton({
  isSaved,
  onToggleScrap,
  video,
  videoTitle,
}) {
  const buttonText = isSaved ? '보관 해제' : '소재 보관';
  const actionText = isSaved
    ? 'Cloud 스크랩북에서 보관을 해제합니다'
    : 'Cloud 스크랩북에 소재로 보관합니다';

  return (
    <button
      type="button"
      onClick={() => onToggleScrap(video)}
      className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-extrabold ${isSaved ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300' : 'bg-yellow-500/10 text-yellow-100 ring-1 ring-yellow-400/20 hover:bg-yellow-500/15'}`}
      title={actionText}
      aria-label={`${videoTitle} ${actionText}`}
    >
      <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-slate-950' : ''}`} /> {buttonText}
    </button>
  );
}
