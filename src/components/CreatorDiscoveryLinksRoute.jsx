import DiscoveryLinksWorkspace from './DiscoveryLinksWorkspace';

export default function CreatorDiscoveryLinksRoute({
  addDiscoveryLink,
  changeDiscoveryLink,
  creatorViewIntent,
  discoveryLinks,
  discoveryLinksError,
  discoveryLinksLoading,
  discoveryLinksNotice,
  discoveryLinksSaving,
  discoveryLinksSavingMessage,
  loadDiscoveryLinks,
  onOpenProductionCandidates,
  removeDiscoveryLink,
}) {
  return (
    <DiscoveryLinksWorkspace
      error={discoveryLinksError}
      initialSearchQuery={creatorViewIntent?.searchQuery || ''}
      initialSearchSource={creatorViewIntent?.source || ''}
      initialTargetDiscoveryLinkId={creatorViewIntent?.targetDiscoveryLinkId || ''}
      links={discoveryLinks}
      loading={discoveryLinksLoading}
      notice={discoveryLinksNotice}
      saving={discoveryLinksSaving}
      savingMessage={discoveryLinksSavingMessage}
      onCreateLink={addDiscoveryLink}
      onDeleteLink={removeDiscoveryLink}
      onOpenProductionCandidates={onOpenProductionCandidates}
      onRefresh={loadDiscoveryLinks}
      onUpdateLink={changeDiscoveryLink}
    />
  );
}
