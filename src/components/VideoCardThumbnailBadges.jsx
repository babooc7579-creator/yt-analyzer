import { Rocket, TrendingUp } from 'lucide-react';

export default function VideoCardThumbnailBadges({
  isCandidate,
  isStrongReaction,
  rank,
}) {
  return (
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
  );
}
