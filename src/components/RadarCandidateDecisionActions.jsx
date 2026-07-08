import RadarCandidateProductionButton from './RadarCandidateProductionButton';
import RadarCandidateScrapButton from './RadarCandidateScrapButton';
import RadarCandidateStatusActions from './RadarCandidateStatusActions';
import { getRadarCandidateDecisionActionsViewProps } from '../utils/radarCandidateStateProps';

export default function RadarCandidateDecisionActions({
  isSaved,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
  video,
  videoTitle,
}) {
  const viewProps = getRadarCandidateDecisionActionsViewProps();

  return (
    <>
      <p className="mt-3 text-[10px] font-bold text-slate-400">
        {viewProps.descriptionText}
      </p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <RadarCandidateScrapButton
          isSaved={isSaved}
          onToggleScrap={onToggleScrap}
          video={video}
          videoTitle={videoTitle}
        />
        <RadarCandidateProductionButton
          onPromoteToProduction={onPromoteToProduction}
          video={video}
          videoTitle={videoTitle}
        />
        <RadarCandidateStatusActions
          onMarkVideoStatus={onMarkVideoStatus}
          video={video}
          videoTitle={videoTitle}
        />
      </div>
    </>
  );
}
