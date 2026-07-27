const toArray = (items) => (Array.isArray(items) ? items : []);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getVideoId = (video) => String(video?.videoId || video?.video_id || '').trim();

export const mergeUploadCalendarVideos = ({ savedVideos, videos } = {}) => {
  const mergedVideos = [];
  const videoIndexes = new Map();

  [...toArray(savedVideos), ...toArray(videos)].forEach((video) => {
    if (!video || typeof video !== 'object') return;

    const videoId = getVideoId(video);
    if (!videoId) {
      mergedVideos.push(video);
      return;
    }

    const existingIndex = videoIndexes.get(videoId);
    if (existingIndex === undefined) {
      videoIndexes.set(videoId, mergedVideos.length);
      mergedVideos.push(video);
      return;
    }

    mergedVideos[existingIndex] = {
      ...mergedVideos[existingIndex],
      ...video,
    };
  });

  return mergedVideos;
};

export const getUploadCalendarProductionSearchQuery = (item = {}) => String(
  item.draftTitle || item.title || item.sourceTitle || item.videoId || '',
).trim();

export function buildUploadCalendarRouteProps({
  creatorViewIntent,
  openCreatorView,
  savedVideos,
  videoUserRecords,
  videos,
} = {}) {
  return {
    initialTargetPublishDate: DATE_PATTERN.test(String(creatorViewIntent?.targetPublishDate || ''))
      ? creatorViewIntent.targetPublishDate
      : '',
    initialTargetVideoId: String(creatorViewIntent?.targetVideoId || '').trim(),
    onOpenScriptBoard: (item) => openCreatorView({
      id: 'studio-script',
      intent: {
        source: 'upload-calendar',
        targetVideoId: String(item?.videoId || '').trim(),
      },
    }),
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
    videos: mergeUploadCalendarVideos({ savedVideos, videos }),
  };
}
