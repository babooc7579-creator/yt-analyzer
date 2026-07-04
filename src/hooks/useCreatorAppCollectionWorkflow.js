import { useVideoCollectionActions } from './useVideoCollectionActions';

export function useCreatorAppCollectionWorkflow({
  clearCheckedVideos,
  loadChannelsFromCloud,
  savedChannels,
  selectedChannelIds,
  setActiveTab,
  setError,
  setIsScanning,
  setLoading,
  setProgressMsg,
  setScanningTag,
  setVideos,
}) {
  return useVideoCollectionActions({
    clearCheckedVideos,
    loadChannelsFromCloud,
    savedChannels,
    selectedChannelIds,
    setActiveTab,
    setError,
    setIsScanning,
    setLoading,
    setProgressMsg,
    setScanningTag,
    setVideos,
  });
}
