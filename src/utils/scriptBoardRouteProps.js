const toArray = (items) => (Array.isArray(items) ? items : []);

export const getScriptBoardCalendarIntent = (item = {}) => {
  const video = item?.video && typeof item.video === 'object' ? item.video : item;
  const record = item?.record && typeof item.record === 'object' ? item.record : {};
  const targetVideoId = String(video?.videoId || item?.videoId || '').trim();
  const targetPublishDate = String(record?.targetPublishDate || item?.targetPublishDate || '').trim();

  if (!targetVideoId && !targetPublishDate) return undefined;

  return {
    source: 'script-board',
    targetPublishDate,
    targetVideoId,
  };
};

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
    onOpenImprovementLog: () => openView({ id: 'insight-notes' }),
    onOpenProductionCandidates: (video = {}) => openView({
      id: 'studio-candidates',
      intent: video?.videoId ? {
        searchQuery: video.draftTitle || video.title || '',
        source: 'script-board',
        targetVideoId: video.videoId,
      } : undefined,
    }),
    onOpenUploadCalendar: (item) => {
      const intent = getScriptBoardCalendarIntent(item);
      return openView({
        id: 'studio-calendar',
        ...(intent ? { intent } : {}),
      });
    },
    onUnsavedDraftsChange: setHasUnsavedProductionDrafts,
    onUpdateVideoRecord: updateVideoUserRecord,
    videoUserRecords: videoUserRecords && typeof videoUserRecords === 'object' ? videoUserRecords : {},
    videos: toArray(savedVideos),
  };
}
