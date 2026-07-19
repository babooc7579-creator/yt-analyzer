import { useEffect, useState } from 'react';

import { useStoredVideoLoadFeedback } from '../hooks/useStoredVideoLoadFeedback';
import LegacyWorkspaceView from './LegacyWorkspaceView';
import {
  getLegacyAsideProps,
  getLegacyChannelPanelProps,
  getLegacyMainPanelProps,
} from '../utils/legacyWorkspaceProps';
import { getChannelOperationStage } from '../utils/channelOperations';

export default function CreatorLegacyWorkspaceRoute(props) {
  const requestedOperationStage = getChannelOperationStage(props.creatorViewIntent?.operationStage).id;
  const [activeOperationStage, setActiveOperationStage] = useState(requestedOperationStage);
  const isChannelOperationsView = props.creatorView === 'ops-channels';
  const selectedChannelKey = [...(Array.isArray(props.selectedChannelIds) ? props.selectedChannelIds : [])]
    .sort()
    .join('|');
  const {
    loadResult: storedVideoLoadResult,
    loading: storedVideoLoadPending,
    onLoadStoredVideos: loadStoredVideos,
  } = useStoredVideoLoadFeedback({
    loading: props.loading,
    onLoad: props.loadStoredVideosForSelectedChannels,
    selectionKey: selectedChannelKey,
  });

  const scrollToOperationStage = (stageId, behavior = 'smooth') => {
    const stage = getChannelOperationStage(stageId);
    setActiveOperationStage(stage.id);
    if (typeof document === 'undefined') return;
    document.getElementById(stage.targetId)?.scrollIntoView({ behavior, block: 'start' });
  };

  useEffect(() => {
    setActiveOperationStage(requestedOperationStage);
    if (!isChannelOperationsView || !props.creatorViewIntent?.operationStage) return undefined;

    const timerId = window.setTimeout(() => {
      scrollToOperationStage(requestedOperationStage, 'auto');
    }, 0);
    return () => window.clearTimeout(timerId);
  }, [isChannelOperationsView, props.creatorViewIntent?.operationStage, requestedOperationStage]);

  const legacyWorkspaceViewProps = {
    asideProps: getLegacyAsideProps(props),
    channelPanelProps: getLegacyChannelPanelProps(props),
    mainPanelProps: getLegacyMainPanelProps(props),
    operationsNavProps: isChannelOperationsView ? {
      activeStage: activeOperationStage,
      isLoading: storedVideoLoadPending,
      isScanning: props.isScanning,
      onLoadStoredVideos: loadStoredVideos,
      onOpenHome: () => props.openCreatorView({ id: 'home' }),
      onOpenStoredVideos: () => props.openCreatorView({ id: 'vault-videos' }),
      onSelectStage: scrollToOperationStage,
      savedChannels: props.savedChannels,
      selectedChannelIds: props.selectedChannelIds,
      storedVideoLoadResult,
      videos: props.videos,
    } : null,
    showWorkPanel: props.showWorkPanel,
  };

  return (
    <LegacyWorkspaceView {...legacyWorkspaceViewProps} />
  );
}
