import { useCreatorWorkspaceNavigation } from './useCreatorWorkspaceNavigation';
import { useCreatorAppDiscoveryWorkflow } from './useCreatorAppDiscoveryWorkflow';
import { useTopComments } from './useTopComments';
import { useWorkToolPreferences } from './useWorkToolPreferences';

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
    hasUnsavedWorkToolSettings,
    isChannelWatchlistView,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isKeywordExplorerView,
    isLegacyWorkspaceView,
    isReferenceVaultView,
    isRecentScanStatusView,
    isScriptBoardView,
    isSettingsView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    isWorkToolsView,
    openCreatorView,
    setActiveTab,
    setHasUnsavedProductionDrafts,
    setHasUnsavedWorkToolSettings,
    setShowWorkPanel,
    showWorkPanel,
  } = useCreatorWorkspaceNavigation();
  const workToolWorkflow = useWorkToolPreferences({
    enabled: isSettingsView || isWorkToolsView,
  });
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
    hasUnsavedWorkToolSettings,
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
    isRecentScanStatusView,
    isScriptBoardView,
    isSettingsView,
    isTagVaultView,
    isTtoTtoView,
    isUploadCalendarView,
    isWorkToolsView,
    loadDiscoveryLinks,
    openCreatorView,
    removeDiscoveryLink,
    setActiveTab,
    setHasUnsavedProductionDrafts,
    setHasUnsavedWorkToolSettings,
    setShowWorkPanel,
    showWorkPanel,
    ...workToolWorkflow,
  };
}
