import { getRadarCandidateCardViewProps } from '../utils/radarCandidates';
import RadarCandidateBadges from './RadarCandidateBadges';
import RadarCandidateDecisionActions from './RadarCandidateDecisionActions';
import RadarCandidateMetrics from './RadarCandidateMetrics';
import RadarCandidatePrimaryActions from './RadarCandidatePrimaryActions';
import RadarCandidateScorePanel from './RadarCandidateScorePanel';
import RadarCandidateThumbnail from './RadarCandidateThumbnail';
import RadarCandidateTitleLink from './RadarCandidateTitleLink';

export default function RadarCandidateCard({
  index,
  isSaved,
  video,
  onMarkVideoStatus,
  onPromoteToProduction,
  onToggleScrap,
}) {
  const {
    badgesProps,
    decisionActionsProps,
    metricsProps,
    primaryActionsProps,
    scorePanelProps,
    thumbnailProps,
    titleLinkProps,
  } = getRadarCandidateCardViewProps({
    index,
    isSaved,
    video,
    onMarkVideoStatus,
    onPromoteToProduction,
    onToggleScrap,
  });

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
      <RadarCandidateThumbnail {...thumbnailProps} />
      <div className="p-4">
        <RadarCandidateBadges {...badgesProps} />
        <RadarCandidateTitleLink {...titleLinkProps} />
        <RadarCandidateScorePanel {...scorePanelProps} />
        <RadarCandidateMetrics {...metricsProps} />
        <RadarCandidatePrimaryActions {...primaryActionsProps} />
        <RadarCandidateDecisionActions {...decisionActionsProps} />
      </div>
    </article>
  );
}
