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
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
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
    discoveryLinks,
    discoveryLinksError,
    discoveryLinksLoading,
    discoveryLinksNotice,
    discoveryLinksSaving,
    discoveryLinksSavingMessage,
    fetchTopComments,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    loadDiscoveryLinks,
    openCreatorView,
    removeDiscoveryLink,
    setActiveTab,
    setShowWorkPanel,
    showWorkPanel,
  };
}
