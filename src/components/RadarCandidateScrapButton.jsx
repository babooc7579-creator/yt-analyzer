import { Star } from 'lucide-react';

export default function RadarCandidateScrapButton({
  isSaved,
  onToggleScrap,
  video,
  videoTitle,
}) {
  return (
    <button
      type="button"
      onClick={() => onToggleScrap(video)}
      className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-extrabold ${isSaved ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300' : 'bg-yellow-500/10 text-yellow-100 ring-1 ring-yellow-400/20 hover:bg-yellow-500/15'}`}
      title={isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}
      aria-label={`${videoTitle} ${isSaved ? 'Cloud 스크랩북에서 보관 해제' : 'Cloud 스크랩북에 소재로 보관'}`}
    >
      <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-slate-950' : ''}`} /> {isSaved ? '보관됨' : '소재 보관'}
    </button>
  );
}
