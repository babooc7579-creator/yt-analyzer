import { useCategories } from './useCategories';
import { useChannelActions } from './useChannelActions';
import { useChannelFormState } from './useChannelFormState';
import { useChannelNotesModal } from './useChannelNotesModal';
import { useChannelSelection } from './useChannelSelection';
import { useCloudChannels } from './useCloudChannels';
import { useCreatorAppChannelAddWorkflow } from './useCreatorAppChannelAddWorkflow';
import { useCreatorAppChannelRenameWorkflow } from './useCreatorAppChannelRenameWorkflow';

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

  const renameActions = useCreatorAppChannelRenameWorkflow({
    categoryState,
    channelSelection,
    cloudChannels,
    formState,
    setError,
    setProgressMsg,
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
