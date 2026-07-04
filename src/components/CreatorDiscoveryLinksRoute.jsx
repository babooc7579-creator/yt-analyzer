import DiscoveryLinksWorkspace from './DiscoveryLinksWorkspace';

export default function CreatorDiscoveryLinksRoute({
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
  return (
    <DiscoveryLinksWorkspace
      error={discoveryLinksError}
      links={discoveryLinks}
      loading={discoveryLinksLoading}
      notice={discoveryLinksNotice}
      saving={discoveryLinksSaving}
      savingMessage={discoveryLinksSavingMessage}
      onCreateLink={addDiscoveryLink}
      onDeleteLink={removeDiscoveryLink}
      onRefresh={loadDiscoveryLinks}
      onUpdateLink={changeDiscoveryLink}
    />
  );
}
