import { useVideoCollectionActions } from './useVideoCollectionActions';

export function useCreatorAppCollectionWorkflow({
  channelWorkflow,
  runtime,
  videoWorkflow,
  workspaceWorkflow,
}) {
  return useVideoCollectionActions({
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
    setVideos: runtime.setVideos,
  });
}
