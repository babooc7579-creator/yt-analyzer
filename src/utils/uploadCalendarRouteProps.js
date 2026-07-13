const toArray = (items) => (Array.isArray(items) ? items : []);

export const getUploadCalendarProductionSearchQuery = (item = {}) => String(
  item.draftTitle || item.title || item.sourceTitle || item.videoId || '',
).trim();

export function buildUploadCalendarRouteProps({ openCreatorView, videoUserRecords, videos } = {}) {
  return {
    onOpenProductionCandidate: (item) => openCreatorView({
      id: 'studio-candidates',
      intent: {
        searchQuery: getUploadCalendarProductionSearchQuery(item),
        source: 'upload-calendar',
        targetVideoId: String(item?.videoId || '').trim(),
      },
    }),
    onOpenProductionCandidates: () => openCreatorView({ id: 'studio-candidates' }),
    videoUserRecords: videoUserRecords && typeof videoUserRecords === 'object' ? videoUserRecords : {},
    videos: toArray(videos),
  };
}
