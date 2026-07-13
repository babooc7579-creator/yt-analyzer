const toArray = (items) => (Array.isArray(items) ? items : []);

export function buildUploadCalendarRouteProps({ openCreatorView, videoUserRecords, videos } = {}) {
  return {
    onOpenProductionCandidates: () => openCreatorView({ id: 'studio-candidates' }),
    videoUserRecords: videoUserRecords && typeof videoUserRecords === 'object' ? videoUserRecords : {},
    videos: toArray(videos),
  };
}
