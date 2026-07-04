import ScrapbookWorkspace from './ScrapbookWorkspace';

export default function LegacyVaultTab({
  copiedPrompt,
  copyPromptForVideos,
  creatorView,
  discoveryLinks,
  fetchTopComments,
  markRadarVideoStatus,
  openCreatorView,
  promptCopyError,
  savedVideos,
  toggleScrapVideo,
  updateDiscoveryLink,
  updateVideoUserRecord,
  videoUserRecords,
}) {
  const scrapbookWorkspaceProps = {
    creatorView,
    discoveryLinks,
    copiedPrompt,
    promptCopyError,
    savedVideos,
    videoUserRecords,
    onCopyPrompt: () => copyPromptForVideos(savedVideos),
    onFetchComments: fetchTopComments,
    onMoveVideo: markRadarVideoStatus,
    onOpenDiscoveryLinks: () => openCreatorView({ id: 'vault-sources' }),
    onOpenReferenceVault: () => openCreatorView({ id: 'vault-all' }),
    onRemoveScrap: toggleScrapVideo,
    onUpdateDiscoveryLink: updateDiscoveryLink,
    onUpdateVideoRecord: updateVideoUserRecord,
  };

  return (
    <ScrapbookWorkspace {...scrapbookWorkspaceProps} />
  );
}
