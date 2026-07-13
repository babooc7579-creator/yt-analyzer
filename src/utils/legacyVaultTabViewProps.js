const toArray = (items) => (Array.isArray(items) ? items : []);

export function getLegacyVaultTabViewProps({
  copiedPrompt,
  copyPromptForVideos,
  creatorView,
  creatorViewIntent,
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
      creatorViewIntent,
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
      onOpenUploadCalendar: () => openCreatorView({ id: 'studio-calendar' }),
      onRemoveScrap: toggleScrapVideo,
      onUpdateDiscoveryLink: updateDiscoveryLink,
      onUpdateVideoRecord: updateVideoUserRecord,
    },
  };
}
