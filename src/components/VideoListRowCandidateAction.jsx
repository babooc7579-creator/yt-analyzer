import { Rocket } from 'lucide-react';
import { getVideoListRowCandidateActionViewProps } from '../utils/videoListRowCandidateActionProps';

export default function VideoListRowCandidateAction({
  disabled,
  isProductionCandidate,
  onPromote,
  videoTitle,
}) {
  const {
    buttonLabel,
    buttonProps,
  } = getVideoListRowCandidateActionViewProps({
    disabled,
    isProductionCandidate,
    onPromote,
    videoTitle,
  });

  return (
    <button {...buttonProps}>
      <Rocket className="h-3.5 w-3.5" />
      {buttonLabel}
    </button>
  );
}
