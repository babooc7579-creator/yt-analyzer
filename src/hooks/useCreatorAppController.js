import { useAppRuntimeState } from './useAppRuntimeState';
import { useCreatorAppChannelWorkflow } from './useCreatorAppChannelWorkflow';
import { useCreatorAppDerivedState } from './useCreatorAppDerivedState';
import { useCreatorAppVideoWorkflow } from './useCreatorAppVideoWorkflow';
import { useCreatorAppViewProps } from './useCreatorAppViewProps';
import { useCreatorAppWorkspaceWorkflow } from './useCreatorAppWorkspaceWorkflow';
import { useVideoCollectionActions } from './useVideoCollectionActions';

export function useCreatorAppController() {
  const runtime = useAppRuntimeState();

  const channelWorkflow = useCreatorAppChannelWorkflow({
    setError: runtime.setError,
    setLoading: runtime.setLoading,
    setProgressMsg: runtime.setProgressMsg,
    setUpdatingChannelId: runtime.setUpdatingChannelId,
  });

  const videoWorkflow = useCreatorAppVideoWorkflow({
    videos: runtime.videos,
  });

  const workspaceWorkflow = useCreatorAppWorkspaceWorkflow({
    apiKey: runtime.apiKey,
    setError: runtime.setError,
  });

  const collectionWorkflow = useVideoCollectionActions({
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

  const derivedState = useCreatorAppDerivedState({
    categories: channelWorkflow.categories,
    discoveryLinks: workspaceWorkflow.discoveryLinks,
    savedChannels: channelWorkflow.savedChannels,
    savedVideos: videoWorkflow.savedVideos,
    scrapbookSyncWarning: videoWorkflow.scrapbookSyncWarning,
    selectedChannelIds: channelWorkflow.selectedChannelIds,
    videoRecordsSyncWarning: videoWorkflow.videoRecordsSyncWarning,
    videoUserRecords: videoWorkflow.videoUserRecords,
    videos: runtime.videos,
  });

  return useCreatorAppViewProps({
    ...runtime,
    ...channelWorkflow,
    ...videoWorkflow,
    ...workspaceWorkflow,
    ...collectionWorkflow,
    ...derivedState,
  });
}
