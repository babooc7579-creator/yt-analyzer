import { useRef, useState } from 'react';

import { useRadarCandidateData } from '../hooks/useRadarCandidateData';
import { getRadarCandidateStripViewProps } from '../utils/radarCandidates';
import RadarCandidateCompletedState from './RadarCandidateCompletedState';
import RadarCandidateEmptyState from './RadarCandidateEmptyState';
import RadarCandidateGrid from './RadarCandidateGrid';
import RadarCandidateStripHeader from './RadarCandidateStripHeader';
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
    onMarkVideoStatus,
    onOpenScrapbook,
    onOpenProductionCandidates,
    onOpenVault,
    onPromoteToProduction,
    onRestoreVideo,
    onToggleScrap,
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

      <RadarCandidateGrid {...gridProps} />
    </div>
  );
}
