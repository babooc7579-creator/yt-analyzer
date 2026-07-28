import {
  getDiscoveryLinkIdFromScriptSourceId,
  getDiscoveryLinkScriptSaveUpdates,
  getDiscoveryLinkScriptSourceId,
  getDiscoveryLinkScriptSources,
  getScriptSourceRecordMap,
} from './discoveryLinkScriptSource';

const toArray = (items) => (Array.isArray(items) ? items : []);

export const getScriptBoardCalendarIntent = (item = {}) => {
  const video = item?.video && typeof item.video === 'object' ? item.video : item;
  const record = item?.record && typeof item.record === 'object' ? item.record : {};
  const targetVideoId = String(video?.videoId || item?.videoId || '').trim();
  const targetDiscoveryLinkId = String(
    video?.discoveryLinkId
      || item?.discoveryLinkId
      || getDiscoveryLinkIdFromScriptSourceId(targetVideoId),
  ).trim();
  const targetPublishDate = String(record?.targetPublishDate || item?.targetPublishDate || '').trim();

  if (!targetVideoId && !targetPublishDate) return undefined;

  return {
    source: 'script-board',
    targetPublishDate,
    targetVideoId,
    ...(targetDiscoveryLinkId ? { targetDiscoveryLinkId } : {}),
  };
};

export function buildScriptBoardRouteProps({
  creatorViewIntent,
  discoveryLinks,
  onConfirmUnsavedNavigation,
  openCreatorView,
  savedVideos,
  setHasUnsavedProductionDrafts,
  updateVideoUserRecord,
  videoUserRecords,
} = {}) {
  const openView = typeof openCreatorView === 'function' ? openCreatorView : () => {};
  const savedRecordMap = videoUserRecords && typeof videoUserRecords === 'object'
    ? videoUserRecords
    : {};
  const discoverySources = getDiscoveryLinkScriptSources(discoveryLinks);
  const scriptRecordMap = getScriptSourceRecordMap({
    discoveryLinks,
    videoUserRecords: savedRecordMap,
  });
  const targetDiscoveryLinkId = String(creatorViewIntent?.targetDiscoveryLinkId || '').trim();
  const initialTargetVideoId = targetDiscoveryLinkId
    ? getDiscoveryLinkScriptSourceId({ id: targetDiscoveryLinkId })
    : String(creatorViewIntent?.targetVideoId || '').trim();
  const updateScriptRecord = typeof updateVideoUserRecord === 'function'
    ? (sourceId, updates) => updateVideoUserRecord(
      sourceId,
      getDiscoveryLinkScriptSaveUpdates({
        sourceId,
        updates,
        videoUserRecords: savedRecordMap,
      }),
    )
    : undefined;

  return {
    initialTargetVideoId,
    onConfirmUnsavedNavigation,
    onOpenHome: () => openView({ id: 'home' }),
    onOpenImprovementLog: () => openView({ id: 'insight-notes' }),
    onOpenProductionCandidates: (video = {}) => openView({
      id: 'studio-candidates',
      intent: video?.videoId || video?.discoveryLinkId ? {
        searchQuery: video.draftTitle || video.title || '',
        source: 'script-board',
        ...(video.sourceType === 'discovery_link' || video.discoveryLinkId
          ? { targetDiscoveryLinkId: video.discoveryLinkId || getDiscoveryLinkIdFromScriptSourceId(video.videoId) }
          : { targetVideoId: video.videoId }),
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
    onUpdateVideoRecord: updateScriptRecord,
    videoUserRecords: scriptRecordMap,
    videos: [...toArray(savedVideos), ...discoverySources],
  };
}
