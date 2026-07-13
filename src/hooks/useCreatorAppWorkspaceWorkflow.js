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
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    openCreatorView,
    setActiveTab,
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
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    loadDiscoveryLinks,
    openCreatorView,
    removeDiscoveryLink,
    setActiveTab,
    setShowWorkPanel,
    showWorkPanel,
  };
}
