import {
  getDiscoveryLinkIdFromScriptSourceId,
  getDiscoveryLinkScriptSourceId,
  getDiscoveryLinkScriptSources,
  getScriptSourceRecordMap,
} from './discoveryLinkScriptSource';

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
  discoveryLinks,
  openCreatorView,
  productionSourceVideos,
  savedVideos,
  videoUserRecords,
  videos,
} = {}) {
  const targetDiscoveryLinkId = String(creatorViewIntent?.targetDiscoveryLinkId || '').trim();
  const initialTargetVideoId = targetDiscoveryLinkId
    ? getDiscoveryLinkScriptSourceId({ id: targetDiscoveryLinkId })
    : String(creatorViewIntent?.targetVideoId || '').trim();
  const discoverySources = getDiscoveryLinkScriptSources(discoveryLinks);

  return {
    initialTargetPublishDate: DATE_PATTERN.test(String(creatorViewIntent?.targetPublishDate || ''))
      ? creatorViewIntent.targetPublishDate
      : '',
    initialTargetVideoId,
    onOpenScriptBoard: (item) => openCreatorView({
      id: 'studio-script',
      intent: {
        source: 'upload-calendar',
        targetVideoId: String(item?.videoId || '').trim(),
        ...(getDiscoveryLinkIdFromScriptSourceId(item?.videoId)
          ? { targetDiscoveryLinkId: getDiscoveryLinkIdFromScriptSourceId(item.videoId) }
          : {}),
      },
    }),
    onOpenProductionCandidate: (item) => openCreatorView({
      id: 'studio-candidates',
      intent: {
        searchQuery: getUploadCalendarProductionSearchQuery(item),
        source: 'upload-calendar',
        ...(getDiscoveryLinkIdFromScriptSourceId(item?.videoId)
          ? { targetDiscoveryLinkId: getDiscoveryLinkIdFromScriptSourceId(item.videoId) }
          : { targetVideoId: String(item?.videoId || '').trim() }),
      },
    }),
    onOpenProductionCandidates: () => openCreatorView({ id: 'studio-candidates' }),
    videoUserRecords: getScriptSourceRecordMap({ discoveryLinks, videoUserRecords }),
    videos: mergeUploadCalendarVideos({
      savedVideos: [
        ...toArray(Array.isArray(productionSourceVideos) ? productionSourceVideos : savedVideos),
        ...discoverySources,
      ],
      videos,
    }),
  };
}
