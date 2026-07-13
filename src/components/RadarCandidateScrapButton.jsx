import { Star } from 'lucide-react';

import { getRadarCandidateScrapButtonActionProps } from '../utils/radarCandidateStateProps';

export default function RadarCandidateScrapButton({
  isSaved,
  onToggleScrap,
  saving,
  video,
  videoTitle,
}) {
  const buttonProps = getRadarCandidateScrapButtonActionProps({
    isSaved,
    onToggleScrap,
    saving,
    video,
    videoTitle,
  });

  return (
    <button
      type="button"
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      className={`inline-flex items-center justify-center gap-1 rounded-xl px-3 py-2 text-[11px] font-extrabold disabled:cursor-not-allowed disabled:opacity-50 ${isSaved ? 'bg-yellow-400 text-slate-950 hover:bg-yellow-300 disabled:hover:bg-yellow-400' : 'bg-yellow-500/10 text-yellow-100 ring-1 ring-yellow-400/20 hover:bg-yellow-500/15 disabled:hover:bg-yellow-500/10'}`}
      title={buttonProps.title}
      aria-label={buttonProps['aria-label']}
    >
      <Star className={`h-3.5 w-3.5 ${isSaved ? 'fill-slate-950' : ''}`} /> {buttonProps.buttonText}
    </button>
  );
}
