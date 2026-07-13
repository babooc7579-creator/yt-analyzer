import { useRef, useState } from 'react';

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
  const actionLockRef = useRef(false);
  const [pendingAction, setPendingAction] = useState('');

  const runCloudAction = async (actionKey, action, ...args) => {
    if (actionLockRef.current || typeof action !== 'function') return false;

    actionLockRef.current = true;
    setPendingAction(actionKey);
    try {
      return await action(...args);
    } finally {
      actionLockRef.current = false;
      setPendingAction('');
    }
  };

  const handleMarkVideoStatus = typeof onMarkVideoStatus === 'function'
    ? (videoId, status) => runCloudAction('status', onMarkVideoStatus, videoId, status)
    : onMarkVideoStatus;
  const handlePromoteToProduction = typeof onPromoteToProduction === 'function'
    ? (targetVideo) => runCloudAction('production', onPromoteToProduction, targetVideo)
    : onPromoteToProduction;
  const handleToggleScrap = typeof onToggleScrap === 'function'
    ? (targetVideo) => runCloudAction('scrapbook', onToggleScrap, targetVideo)
    : onToggleScrap;
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
    pendingAction,
    video,
    onMarkVideoStatus: handleMarkVideoStatus,
    onPromoteToProduction: handlePromoteToProduction,
    onToggleScrap: handleToggleScrap,
  });

  return (
    <article
      aria-busy={Boolean(pendingAction)}
      className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80"
    >
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
