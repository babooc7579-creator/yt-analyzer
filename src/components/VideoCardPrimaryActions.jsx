import { Rocket, Star } from 'lucide-react';

export default function VideoCardPrimaryActions({
  isProductionCandidate,
  isSaved,
  onPromoteToProduction,
  onToggleScrap,
  video,
  videoTitle,
}) {
  return (
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
  );
}
