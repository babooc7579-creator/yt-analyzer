import { Rocket } from 'lucide-react';

import { getRadarCandidateProductionButtonActionProps } from '../utils/radarCandidateStateProps';

export default function RadarCandidateProductionButton({
  onPromoteToProduction,
  saving,
  video,
  videoTitle,
}) {
  const buttonProps = getRadarCandidateProductionButtonActionProps({
    onPromoteToProduction,
    saving,
    video,
    videoTitle,
  });

  return (
    <button
      type="button"
      onClick={buttonProps.onClick}
      disabled={buttonProps.disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-3 py-2.5 text-xs font-extrabold text-white shadow-sm shadow-indigo-950/30 transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-500"
      title={buttonProps.title}
      aria-label={buttonProps['aria-label']}
    >
      <Rocket className="h-4 w-4" /> {buttonProps.label}
    </button>
  );
}
