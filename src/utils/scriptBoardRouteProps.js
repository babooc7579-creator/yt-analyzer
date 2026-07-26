const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildScriptBoardRouteProps({
  creatorViewIntent,
  onConfirmUnsavedNavigation,
  openCreatorView,
  savedVideos,
  setHasUnsavedProductionDrafts,
  updateVideoUserRecord,
  videoUserRecords,
} = {}) {
  const openView = typeof openCreatorView === 'function' ? openCreatorView : () => {};

  return {
    initialTargetVideoId: String(creatorViewIntent?.targetVideoId || '').trim(),
    onConfirmUnsavedNavigation,
    onOpenHome: () => openView({ id: 'home' }),
    onOpenProductionCandidates: (video = {}) => openView({
      id: 'studio-candidates',
      intent: video?.videoId ? {
        searchQuery: video.draftTitle || video.title || '',
        source: 'script-board',
        targetVideoId: video.videoId,
      } : undefined,
    }),
    onOpenUploadCalendar: () => openView({ id: 'studio-calendar' }),
    onUnsavedDraftsChange: setHasUnsavedProductionDrafts,
    onUpdateVideoRecord: updateVideoUserRecord,
    videoUserRecords: videoUserRecords && typeof videoUserRecords === 'object' ? videoUserRecords : {},
    videos: toArray(savedVideos),
  };
}
