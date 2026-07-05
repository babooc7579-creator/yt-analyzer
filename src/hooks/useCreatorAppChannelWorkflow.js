import { useCategories } from './useCategories';
import { useChannelActions } from './useChannelActions';
import { useChannelAddActions } from './useChannelAddActions';
import { useChannelFormState } from './useChannelFormState';
import { useChannelNotesModal } from './useChannelNotesModal';
import { useChannelSelection } from './useChannelSelection';
import { useCloudChannels } from './useCloudChannels';
import { useTagRenameActions } from './useTagRenameActions';

export function useCreatorAppChannelWorkflow({
  setError,
  setLoading,
  setProgressMsg,
  setUpdatingChannelId,
}) {
  const categoryState = useCategories();
  const channelSelection = useChannelSelection(categoryState.categories[0]);
  const formState = useChannelFormState();
  const cloudChannels = useCloudChannels({ onError: setError });
  const channelActions = useChannelActions({
    setSavedChannels: cloudChannels.setSavedChannels,
    setSelectedChannelIds: channelSelection.setSelectedChannelIds,
    setUpdatingChannelId,
    setError,
  });

  const channelAddActions = useChannelAddActions({
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

  const notesModal = useChannelNotesModal({
    saveChannelNote: channelActions.saveChannelNote,
    onError: setError,
  });

  const renameActions = useTagRenameActions({
    cancelRenameCategory: formState.cancelRenameCategory,
    categories: categoryState.categories,
    loadChannelsFromCloud: cloudChannels.loadChannelsFromCloud,
    renameValue: formState.renameValue,
    renamingCategory: formState.renamingCategory,
    selectedCategoryTab: channelSelection.selectedCategoryTab,
    setCategories: categoryState.setCategories,
    setError,
    setProgressMsg,
    setRenameLoading: formState.setRenameLoading,
    setSelectedCategoryTab: channelSelection.setSelectedCategoryTab,
  });

  return {
    ...categoryState,
    ...channelSelection,
    ...formState,
    ...cloudChannels,
    ...channelActions,
    ...channelAddActions,
    ...notesModal,
    ...renameActions,
  };
}
