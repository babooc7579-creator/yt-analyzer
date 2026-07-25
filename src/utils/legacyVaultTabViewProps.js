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
  setHasUnsavedProductionDrafts,
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
      onUnsavedDraftsChange: setHasUnsavedProductionDrafts,
      videoUserRecords,
      onCopyPrompt: () => copyPromptForVideos(savedVideoList),
      onFetchComments: fetchTopComments,
      onMoveVideo: markRadarVideoStatus,
      onOpenDiscoveryLinks: (link = {}) => openCreatorView({
        id: 'vault-sources',
        intent: link?.id ? {
          searchQuery: link.title || link.url || '',
          source: 'studio-candidates',
          targetDiscoveryLinkId: link.id,
        } : undefined,
      }),
      onOpenHome: () => openCreatorView({ id: 'home' }),
      onOpenProductionCandidates: (video = {}) => openCreatorView({
        id: 'studio-candidates',
        intent: {
          searchQuery: video.title || '',
          source: 'scrapbook',
          targetVideoId: video.videoId || '',
        },
      }),
      onOpenReferenceVault: () => openCreatorView({ id: 'vault-all' }),
      onOpenUploadCalendar: () => openCreatorView({ id: 'studio-calendar' }),
      onRemoveScrap: toggleScrapVideo,
      onUpdateDiscoveryLink: updateDiscoveryLink,
      onUpdateVideoRecord: updateVideoUserRecord,
    },
  };
}
