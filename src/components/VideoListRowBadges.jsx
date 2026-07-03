import { CheckSquare, Rocket, Star, TrendingUp } from 'lucide-react';

export default function VideoListRowBadges({
  isChecked,
  isProductionCandidate,
  isSaved,
  isStrongReaction,
  isTtoTto,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-2">
      {isSaved && (
        <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-1 text-[10px] font-bold text-yellow-700">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" /> 소재 보관됨
        </span>
      )}
      {isProductionCandidate && (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
          <Rocket className="w-3 h-3" /> 제작 후보
        </span>
      )}
      {isChecked && (
        <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold text-indigo-700">
          <CheckSquare className="w-3 h-3" /> AI 리메이크 선택
        </span>
      )}
      {(isStrongReaction || isTtoTto) && (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
          <Rocket className="w-3 h-3" /> 또터또 후보
        </span>
      )}
      {isStrongReaction && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700">
          <TrendingUp className="w-3 h-3" /> 강한 반응
        </span>
      )}
    </div>
  );
}
