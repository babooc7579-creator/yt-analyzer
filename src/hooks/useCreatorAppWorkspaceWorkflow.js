import { useCreatorWorkspaceNavigation } from './useCreatorWorkspaceNavigation';
import { useCreatorAppDiscoveryWorkflow } from './useCreatorAppDiscoveryWorkflow';
import { useTopComments } from './useTopComments';

export function useCreatorAppWorkspaceWorkflow({ apiKey, setError }) {
  const {
    closeTopCommentsModal,
    commentModal,
    fetchTopComments,
  } = useTopComments({ apiKey, onError: setError });
  const {
    activeCreatorItem,
    activeTab,
    creatorView,
    creatorViewIntent,
    hasUnsavedProductionDrafts,
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isSettingsView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    openCreatorView,
    setActiveTab,
    setHasUnsavedProductionDrafts,
    setShowWorkPanel,
    showWorkPanel,
  } = useCreatorWorkspaceNavigation();
  const discoveryWorkflow = useCreatorAppDiscoveryWorkflow();
  const {
    discoveryLinks,
    discoveryLinksError,
    discoveryLinksLoading,
    discoveryLinksNotice,
    discoveryLinksSaving,
    discoveryLinksSavingMessage,
    addDiscoveryLink,
    changeDiscoveryLink,
    loadDiscoveryLinks,
    removeDiscoveryLink,
  } = discoveryWorkflow;

  return {
    activeCreatorItem,
    activeTab,
    addDiscoveryLink,
    changeDiscoveryLink,
    closeTopCommentsModal,
    commentModal,
    creatorView,
    creatorViewIntent,
    hasUnsavedProductionDrafts,
    discoveryLinks,
    discoveryLinksError,
    discoveryLinksLoading,
    discoveryLinksNotice,
    discoveryLinksSaving,
    discoveryLinksSavingMessage,
    fetchTopComments,
    isComingSoonView,
    isChannelWatchlistView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isSettingsView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    loadDiscoveryLinks,
    openCreatorView,
    removeDiscoveryLink,
    setActiveTab,
    setHasUnsavedProductionDrafts,
    setShowWorkPanel,
    showWorkPanel,
  };
}
