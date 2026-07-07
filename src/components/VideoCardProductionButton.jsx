import { Rocket } from 'lucide-react';
import { getVideoProductionCandidateActionCopy } from '../utils/videoActionButtonProps';

export default function VideoCardProductionButton({
  isProductionCandidate,
  onPromoteToProduction,
  video,
  videoTitle,
}) {
  const {
    ariaLabel,
    buttonLabel,
    title,
  } = getVideoProductionCandidateActionCopy({
    isProductionCandidate,
    videoTitle,
  });

  return (
    <button
      type="button"
      onClick={() => onPromoteToProduction(video)}
      disabled={isProductionCandidate}
      title={title}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isProductionCandidate ? 'cursor-not-allowed bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
    >
      <Rocket className="h-3.5 w-3.5" />
      {buttonLabel}
    </button>
  );
}
