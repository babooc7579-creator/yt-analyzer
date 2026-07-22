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
    ? (link = {}) => openCreatorView({
      id: 'studio-candidates',
      intent: link?.id ? {
        searchQuery: link.title || link.url || '',
        source: 'discovery-links',
        targetDiscoveryLinkId: link.id,
      } : undefined,
    })
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
