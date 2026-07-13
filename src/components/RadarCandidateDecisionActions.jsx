import RadarCandidateProductionButton from './RadarCandidateProductionButton';
import RadarCandidateScrapButton from './RadarCandidateScrapButton';
import RadarCandidateStatusActions from './RadarCandidateStatusActions';
import { getRadarCandidateDecisionActionsViewProps } from '../utils/radarCandidateStateProps';

export default function RadarCandidateDecisionActions({
  isSaved,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
  pendingAction,
  video,
  videoTitle,
}) {
  const viewProps = getRadarCandidateDecisionActionsViewProps({ pendingAction });
  const saving = Boolean(pendingAction);

  return (
    <>
      <p className="mt-3 text-[10px] font-bold text-slate-400">
        {viewProps.descriptionText}
      </p>
      {viewProps.pendingText ? (
        <p
          aria-live="polite"
          className="mt-2 rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-3 py-2 text-[11px] font-extrabold text-indigo-100"
          role="status"
        >
          {viewProps.pendingText}
        </p>
      ) : null}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <RadarCandidateScrapButton
          isSaved={isSaved}
          onToggleScrap={onToggleScrap}
          saving={saving}
          video={video}
          videoTitle={videoTitle}
        />
        <RadarCandidateProductionButton
          onPromoteToProduction={onPromoteToProduction}
          saving={saving}
          video={video}
          videoTitle={videoTitle}
        />
        <RadarCandidateStatusActions
          onMarkVideoStatus={onMarkVideoStatus}
          saving={saving}
          video={video}
          videoTitle={videoTitle}
        />
      </div>
    </>
  );
}
