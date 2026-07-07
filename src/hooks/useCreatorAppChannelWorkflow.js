import { useCategories } from './useCategories';
import { useChannelActions } from './useChannelActions';
import { useChannelFormState } from './useChannelFormState';
import { useChannelNotesModal } from './useChannelNotesModal';
import { useChannelSelection } from './useChannelSelection';
import { useCloudChannels } from './useCloudChannels';
import { useCreatorAppChannelAddWorkflow } from './useCreatorAppChannelAddWorkflow';
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

  const channelAddActions = useCreatorAppChannelAddWorkflow({
    channelActions,
    channelSelection,
    cloudChannels,
    formState,
    setError,
    setLoading,
    setProgressMsg,
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
