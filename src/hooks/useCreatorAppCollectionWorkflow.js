import { useVideoCollectionActions } from './useVideoCollectionActions';
import { getGuardedProductionDataActionHandlers } from '../utils/productionNavigation';

export function useCreatorAppCollectionWorkflow({
  channelWorkflow,
  runtime,
  videoWorkflow,
  workspaceWorkflow,
}) {
  const collectionActions = useVideoCollectionActions({
    clearCheckedVideos: videoWorkflow.clearCheckedVideos,
    loadChannelsFromCloud: channelWorkflow.loadChannelsFromCloud,
    savedChannels: channelWorkflow.savedChannels,
    selectedChannelIds: channelWorkflow.selectedChannelIds,
    setActiveTab: workspaceWorkflow.setActiveTab,
    setError: runtime.setError,
    setIsScanning: runtime.setIsScanning,
    setLoading: runtime.setLoading,
    setProgressMsg: runtime.setProgressMsg,
    setScanningTag: runtime.setScanningTag,
    setStoredVideoLoadResult: runtime.setStoredVideoLoadResult,
    setVideos: runtime.setVideos,
    storedVideoLoadRequestRef: runtime.storedVideoLoadRequestRef,
  });
  if (!workspaceWorkflow.hasUnsavedProductionDrafts) return collectionActions;

  const confirmNavigation = (message) => (
    typeof window !== 'undefined'
    && typeof window.confirm === 'function'
    && window.confirm(message)
  );

  return getGuardedProductionDataActionHandlers({
    confirmNavigation,
    handlers: collectionActions,
    hasUnsavedDrafts: true,
  });
}
