import { useRef, useState } from 'react';

import { getRadarCandidateCardViewProps } from '../utils/radarCandidates';
import { getRadarCandidateActionErrorMessage } from '../utils/radarCandidateStateProps';
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
  const [actionError, setActionError] = useState('');
  const [pendingAction, setPendingAction] = useState('');

  const runCloudAction = async (actionKey, action, ...args) => {
    if (actionLockRef.current || typeof action !== 'function') return false;

    actionLockRef.current = true;
    setActionError('');
    setPendingAction(actionKey);
    try {
      const result = await action(...args);
      if (result === false) {
        setActionError(getRadarCandidateActionErrorMessage(actionKey));
      }
      return result;
    } catch {
      setActionError(getRadarCandidateActionErrorMessage(actionKey));
      return false;
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
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80"
    >
      <RadarCandidateThumbnail {...thumbnailProps} />
      <div className="flex flex-1 flex-col p-4">
        <RadarCandidateBadges {...badgesProps} />
        <RadarCandidateTitleLink {...titleLinkProps} />
        <RadarCandidateScorePanel {...scorePanelProps} />
        <RadarCandidateMetrics {...metricsProps} />
        <RadarCandidatePrimaryActions {...primaryActionsProps} />
        <RadarCandidateDecisionActions {...decisionActionsProps} />
        {actionError ? (
          <p className="mt-3 border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-[11px] font-extrabold leading-5 text-rose-100" role="alert">
            {actionError}
          </p>
        ) : null}
      </div>
    </article>
  );
}
