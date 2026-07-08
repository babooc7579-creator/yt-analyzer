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
  openCreatorView,
  removeDiscoveryLink,
}) {
  const onOpenProductionCandidates = typeof openCreatorView === 'function'
    ? () => openCreatorView({ id: 'studio-candidates' })
    : undefined;

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
    onOpenProductionCandidates,
    removeDiscoveryLink,
  };
}
