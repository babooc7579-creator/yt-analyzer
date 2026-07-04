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
