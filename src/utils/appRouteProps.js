export { buildLegacyWorkspaceRouteProps } from './legacyWorkspaceRouteProps';

export function buildLayoutProps({
  activeCreatorItem,
  addChannelNote,
  changeNoteText,
  closeNotesModal,
  closeTopCommentsModal,
  commentModal,
  creatorView,
  discoveryCandidateCount,
  notesModal,
  openCreatorView,
  savedChannels,
  savedVideos,
  selectedChannelIds,
  syncWarnings,
  videos,
}) {
  return {
    activeCreatorItem,
    channelCount: savedChannels.length,
    commentModal,
    creatorView,
    discoveryCandidateCount,
    notesModal,
    onAddNote: addChannelNote,
    onChangeNoteText: changeNoteText,
    onCloseNotes: closeNotesModal,
    onCloseTopComments: closeTopCommentsModal,
    onOpenCreatorView: openCreatorView,
    savedVideoCount: savedVideos.length,
    selectedChannelCount: selectedChannelIds.length,
    syncWarnings,
    videoCount: videos.length,
  };
}

export function buildHomeRouteProps({
  clearRadarDecisions,
  discoveryCandidateCount,
  discoveryRightsWarningCount,
  isVideoSaved,
  latestScanText,
  markRadarVideoStatus,
  openCreatorView,
  openRadarCandidateCount,
  productionCandidateCount,
  promoteVideoToProduction,
  restoreVideoToRadar,
  savedChannels,
  savedVideos,
  toggleScrapVideo,
  ttoTtoAssetCount,
  videoUserRecords,
  videos,
}) {
  return {
    clearRadarDecisions,
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    isVideoSaved,
    latestScanText,
    markRadarVideoStatus,
    onOpenView: openCreatorView,
    openRadarCandidateCount,
    productionCandidateCount,
    promoteVideoToProduction,
    restoreVideoToRadar,
    savedChannels,
    savedVideos,
    toggleScrapVideo,
    ttoTtoAssetCount,
    videoUserRecords,
    videos,
  };
}

export function buildDiscoveryLinksRouteProps({
  addDiscoveryLink,
  changeDiscoveryLink,
  discoveryLinks,
  discoveryLinksError,
  discoveryLinksLoading,
  discoveryLinksNotice,
  discoveryLinksSaving,
  discoveryLinksSavingMessage,
  loadDiscoveryLinks,
  removeDiscoveryLink,
}) {
  return {
    addDiscoveryLink,
    changeDiscoveryLink,
    discoveryLinks,
    discoveryLinksError,
    discoveryLinksLoading,
    discoveryLinksNotice,
    discoveryLinksSaving,
    discoveryLinksSavingMessage,
    loadDiscoveryLinks,
    removeDiscoveryLink,
  };
}

export function buildRoutesProps({
  activeCreatorItem,
  discoveryLinksRouteProps,
  homeRouteProps,
  isComingSoonView,
  isDiscoveryLinksView,
  isHomeView,
  isLegacyWorkspaceView,
  legacyWorkspaceRouteProps,
}) {
  return {
    activeCreatorItem,
    discoveryLinksRouteProps,
    homeRouteProps,
    isComingSoonView,
    isDiscoveryLinksView,
    isHomeView,
    isLegacyWorkspaceView,
    legacyWorkspaceRouteProps,
  };
}
