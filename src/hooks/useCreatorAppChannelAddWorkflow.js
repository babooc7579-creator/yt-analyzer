import { useChannelAddActions } from './useChannelAddActions';

export function useCreatorAppChannelAddWorkflow({
  channelActions,
  channelSelection,
  cloudChannels,
  formState,
  setError,
  setLoading,
  setProgressMsg,
}) {
  return useChannelAddActions({
    bulkCreateChannels: channelActions.bulkCreateChannels,
    bulkInput: formState.bulkInput,
    cancelChannelPreview: formState.cancelChannelPreview,
    channelPreview: formState.channelPreview,
    loadChannelsFromCloud: cloudChannels.loadChannelsFromCloud,
    newChannelInput: formState.newChannelInput,
    newChannelLang: formState.newChannelLang,
    newChannelNote: formState.newChannelNote,
    newChannelTags: formState.newChannelTags,
    savedChannels: cloudChannels.savedChannels,
    saveChannel: channelActions.saveChannel,
    setBulkLoading: formState.setBulkLoading,
    setBulkResult: formState.setBulkResult,
    setChannelPreview: formState.setChannelPreview,
    setError,
    setLoading,
    setPreviewLoading: formState.setPreviewLoading,
    setProgressMsg,
    setSelectedCategoryTab: channelSelection.setSelectedCategoryTab,
  });
}
