import { Rocket } from 'lucide-react';
import { getVideoProductionCandidateButtonActionProps } from '../utils/videoActionButtonProps';

export default function VideoCardProductionButton({
  isProductionCandidate,
  onPromoteToProduction,
  video,
  videoTitle,
}) {
  const {
    ariaLabel,
    buttonLabel,
    disabled,
    onClick,
    title,
  } = getVideoProductionCandidateButtonActionProps({
    isProductionCandidate,
    onPromoteToProduction,
    video,
    videoTitle,
  });

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-[11px] font-extrabold transition-colors ${disabled ? 'cursor-not-allowed bg-indigo-100 text-indigo-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
    >
      <Rocket className="h-3.5 w-3.5" />
      {buttonLabel}
    </button>
  );
}
