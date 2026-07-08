import { Rocket } from 'lucide-react';

import { getRadarCandidateProductionButtonProps } from '../utils/radarCandidateStateProps';

export default function RadarCandidateProductionButton({
  onPromoteToProduction,
  video,
  videoTitle,
}) {
  const buttonProps = getRadarCandidateProductionButtonProps({ videoTitle });

  return (
    <button
      type="button"
      onClick={() => onPromoteToProduction(video)}
      className="inline-flex items-center justify-center gap-1 rounded-xl bg-indigo-500/15 px-3 py-2 text-[11px] font-extrabold text-indigo-100 ring-1 ring-indigo-400/20 hover:bg-indigo-500/20"
      title={buttonProps.title}
      aria-label={buttonProps['aria-label']}
    >
      <Rocket className="h-3.5 w-3.5" /> {buttonProps.label}
    </button>
  );
}
