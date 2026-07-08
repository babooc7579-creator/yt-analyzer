const toArray = (items) => (Array.isArray(items) ? items : []);

export function getLegacyVaultTabViewProps({
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
  const savedVideoList = toArray(savedVideos);

  return {
    scrapbookWorkspaceProps: {
      creatorView,
      discoveryLinks,
      copiedPrompt,
      promptCopyError,
      savedVideos: savedVideoList,
      videoUserRecords,
      onCopyPrompt: () => copyPromptForVideos(savedVideoList),
      onFetchComments: fetchTopComments,
      onMoveVideo: markRadarVideoStatus,
      onOpenDiscoveryLinks: () => openCreatorView({ id: 'vault-sources' }),
      onOpenHome: () => openCreatorView({ id: 'home' }),
      onOpenReferenceVault: () => openCreatorView({ id: 'vault-all' }),
      onRemoveScrap: toggleScrapVideo,
      onUpdateDiscoveryLink: updateDiscoveryLink,
      onUpdateVideoRecord: updateVideoUserRecord,
    },
  };
}
