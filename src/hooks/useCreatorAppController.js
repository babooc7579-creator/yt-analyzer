import { useAppRuntimeState } from './useAppRuntimeState';
import { useCreatorAppChannelWorkflow } from './useCreatorAppChannelWorkflow';
import { useCreatorAppCollectionWorkflow } from './useCreatorAppCollectionWorkflow';
import { useCreatorAppDerivedState } from './useCreatorAppDerivedState';
import { useCreatorAppVideoWorkflow } from './useCreatorAppVideoWorkflow';
import { useCreatorAppViewProps } from './useCreatorAppViewProps';
import { useCreatorAppWorkspaceWorkflow } from './useCreatorAppWorkspaceWorkflow';

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

  const collectionWorkflow = useCreatorAppCollectionWorkflow({
    channelWorkflow,
    runtime,
    videoWorkflow,
    workspaceWorkflow,
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
