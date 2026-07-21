import { useRef, useState } from 'react';

import { useRadarCandidateData } from '../hooks/useRadarCandidateData';
import {
  getRadarProductionSuccessFeedback,
  getRadarScrapbookSuccessFeedback,
  getRadarStatusSuccessFeedback,
} from '../utils/radarActionFeedback';
import { getRadarCandidateStripViewProps } from '../utils/radarCandidates';
import RadarCandidateCompletedState from './RadarCandidateCompletedState';
import RadarCandidateEmptyState from './RadarCandidateEmptyState';
import RadarCandidateGrid from './RadarCandidateGrid';
import RadarCandidateStripHeader from './RadarCandidateStripHeader';
import RadarActionSuccessFeedback from './RadarActionSuccessFeedback';
import RadarDecisionPanel from './RadarDecisionPanel';

export default function RadarCandidateStrip({
  videos,
  savedVideos,
  videoUserRecords,
  isVideoSaved,
  onToggleScrap,
  onMarkVideoStatus,
  onPromoteToProduction,
  onRestoreVideo,
  onClearDecisions,
  onLoadStoredVideos,
  onOpenChannelWatchlist,
  onOpenSelectedScan,
  onOpenVault,
  onOpenScrapbook,
  onOpenProductionCandidates,
  selectedChannelCount,
  storedVideoLoadResult,
  storedVideoLoadPending,
}) {
  const clearLockRef = useRef(false);
  const [clearDecisionsPending, setClearDecisionsPending] = useState(false);
  const [recentActionFeedback, setRecentActionFeedback] = useState(null);

  const handleClearDecisions = async () => {
    if (clearLockRef.current || typeof onClearDecisions !== 'function') return false;

    clearLockRef.current = true;
    setClearDecisionsPending(true);
    try {
      return await onClearDecisions();
    } finally {
      clearLockRef.current = false;
      setClearDecisionsPending(false);
    }
  };

  const handlePromoteToProduction = async (video) => {
    if (typeof onPromoteToProduction !== 'function') return false;

    const saved = await onPromoteToProduction(video);
    if (saved !== false) {
      setRecentActionFeedback(getRadarProductionSuccessFeedback(video));
    }
    return saved;
  };

  const handleMarkVideoStatus = async (videoId, status) => {
    if (typeof onMarkVideoStatus !== 'function') return false;

    const saved = await onMarkVideoStatus(videoId, status);
    if (saved !== false) {
      setRecentActionFeedback(getRadarStatusSuccessFeedback({
        status,
        video: Array.isArray(videos)
          ? videos.find(video => video.videoId === videoId)
          : null,
      }));
    }
    return saved;
  };

  const handleToggleScrap = async (video) => {
    if (typeof onToggleScrap !== 'function') return false;

    const removed = typeof isVideoSaved === 'function' && isVideoSaved(video?.videoId);
    const saved = await onToggleScrap(video);
    if (saved !== false) {
      setRecentActionFeedback(getRadarScrapbookSuccessFeedback({ removed, video }));
    }
    return saved;
  };

  const handleFeedbackAction = () => {
    if (recentActionFeedback?.destination === 'production') {
      onOpenProductionCandidates?.(recentActionFeedback.navigationIntent);
    } else if (recentActionFeedback?.destination === 'scrapbook') {
      onOpenScrapbook?.();
    } else if (recentActionFeedback?.destination === 'decisions') {
      const decisionHistory = document.getElementById('today-radar-decision-history');
      decisionHistory?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      decisionHistory?.focus({ preventScroll: true });
    }
  };

  const successFeedback = recentActionFeedback ? (
    <RadarActionSuccessFeedback
      {...recentActionFeedback}
      onDismiss={() => setRecentActionFeedback(null)}
      onAction={handleFeedbackAction}
    />
  ) : null;

  const {
    allDecisionCount,
    candidates,
    decisionGroups,
    decisionSummary,
    loadedDecisionCount,
    queueSummary,
  } = useRadarCandidateData({
    videoUserRecords,
    videos,
  });
  const {
    completedStateProps,
    decisionPanelProps,
    gridProps,
    headerProps,
    isCompleted,
    isEmpty,
  } = getRadarCandidateStripViewProps({
    allDecisionCount,
    candidates,
    decisionGroups,
    decisionSummary,
    isVideoSaved,
    loadedDecisionCount,
    onClearDecisions: handleClearDecisions,
    onMarkVideoStatus: handleMarkVideoStatus,
    onOpenScrapbook,
    onOpenProductionCandidates,
    onOpenVault,
    onPromoteToProduction: handlePromoteToProduction,
    onRestoreVideo,
    onToggleScrap: handleToggleScrap,
    queueSummary,
    savedVideos,
    videos,
  });

  if (isEmpty) {
    return (
      <div id="today-radar-candidates" className="scroll-mt-5">
        <RadarCandidateEmptyState
          onLoadStoredVideos={onLoadStoredVideos}
          onOpenChannelWatchlist={onOpenChannelWatchlist}
          onOpenSelectedScan={onOpenSelectedScan}
          onOpenVault={onOpenVault}
          selectedChannelCount={selectedChannelCount}
          storedVideoLoadResult={storedVideoLoadResult}
          storedVideoLoadPending={storedVideoLoadPending}
        />
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div id="today-radar-candidates" className="scroll-mt-5">
        {successFeedback}
        <RadarCandidateCompletedState
          {...completedStateProps}
          clearDecisionsPending={clearDecisionsPending}
        />
      </div>
    );
  }

  return (
    <div id="today-radar-candidates" className="mt-6 scroll-mt-5 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
      <RadarCandidateStripHeader
        {...headerProps}
        clearDecisionsPending={clearDecisionsPending}
      />

      <RadarDecisionPanel {...decisionPanelProps} />

      {successFeedback}

      <RadarCandidateGrid {...gridProps} />
    </div>
  );
}
