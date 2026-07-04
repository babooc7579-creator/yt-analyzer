import { Star } from 'lucide-react';

export default function VideoCardScrapButton({ isSaved, onToggleScrap, video, videoTitle }) {
  return (
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
  );
}
