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
    <section className="mt-3 border-t border-white/10 pt-3" aria-label="영상 판단 저장">
      <p className="text-[11px] font-extrabold text-white">2. 판단을 저장하세요</p>
      <p className="mt-1 text-[10px] font-bold leading-5 text-slate-400">
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
      <div className="mt-3">
        <RadarCandidateProductionButton
          onPromoteToProduction={onPromoteToProduction}
          saving={saving}
          video={video}
          videoTitle={videoTitle}
        />
      </div>
      <p className="mt-3 text-[10px] font-extrabold text-slate-500">아직 만들지 않을 영상</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <RadarCandidateScrapButton
          isSaved={isSaved}
          onToggleScrap={onToggleScrap}
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
    </section>
  );
}
