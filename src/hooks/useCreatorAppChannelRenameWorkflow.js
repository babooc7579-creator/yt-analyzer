import { useTagRenameActions } from './useTagRenameActions';

export function useCreatorAppChannelRenameWorkflow({
  categoryState,
  channelSelection,
  cloudChannels,
  formState,
  setError,
  setProgressMsg,
}) {
  return useTagRenameActions({
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
}
