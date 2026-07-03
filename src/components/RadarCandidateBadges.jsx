import { Rocket, TrendingUp } from 'lucide-react';

export default function RadarCandidateBadges({ isStrong, isTtoTto }) {
  return (
    <div className="mb-2 flex flex-wrap gap-1.5">
      {isTtoTto && (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-600 px-2 py-1 text-[10px] font-extrabold text-white">
          <Rocket className="h-3 w-3" /> 또터또
        </span>
      )}
      {isStrong && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-700">
          <TrendingUp className="h-3 w-3" /> 강한 반응
        </span>
      )}
    </div>
  );
}
