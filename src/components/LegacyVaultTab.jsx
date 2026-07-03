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
  return (
    <ScrapbookWorkspace
      creatorView={creatorView}
      discoveryLinks={discoveryLinks}
      copiedPrompt={copiedPrompt}
      promptCopyError={promptCopyError}
      savedVideos={savedVideos}
      videoUserRecords={videoUserRecords}
      onCopyPrompt={() => copyPromptForVideos(savedVideos)}
      onFetchComments={fetchTopComments}
      onMoveVideo={markRadarVideoStatus}
      onOpenDiscoveryLinks={() => openCreatorView({ id: 'vault-sources' })}
      onOpenReferenceVault={() => openCreatorView({ id: 'vault-all' })}
      onRemoveScrap={toggleScrapVideo}
      onUpdateDiscoveryLink={updateDiscoveryLink}
      onUpdateVideoRecord={updateVideoUserRecord}
    />
  );
}
