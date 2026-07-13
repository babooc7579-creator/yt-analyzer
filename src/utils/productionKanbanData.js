import {
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusValue,
} from '../constants/discoveryLinks';
import {
  PRODUCTION_STATUS,
  PRODUCTION_STATUSES,
  getProductionStatusFromRecord,
  hasAnyProductionStatus,
} from '../constants/status';
import { getIsoTodayDate } from './dates';

const FALLBACK_TARGET_DATE = '9999-12-31';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

const getVideoId = (video) => (
  video && typeof video === 'object' ? video.videoId : undefined
);

const getProductionVideoGroup = (grouped, status) => toArray(grouped[status]);

const getItemTimestamp = (item) => new Date(item.updatedAt || item.createdAt || 0).getTime();

const getFocusPinnedAt = (record) => (
  typeof record?.focusPinnedAt === 'string' ? record.focusPinnedAt.trim() : ''
);

const getProductionRecord = (video, draftRecords, videoUserRecords) => {
  const videoId = getVideoId(video);
  if (!videoId) return {};

  const drafts = toRecordMap(draftRecords);
  const records = toRecordMap(videoUserRecords);
  return drafts[videoId] || records[videoId] || {};
};

const createEmptyProductionVideoGroups = () => ({
  [PRODUCTION_STATUS.CANDIDATE]: [],
  [PRODUCTION_STATUS.ACTIVE]: [],
  [PRODUCTION_STATUS.DONE]: [],
});

const PRODUCTION_KANBAN_STATUS_GROUPS = {
  [PRODUCTION_STATUS.CANDIDATE]: PRODUCTION_STATUS.CANDIDATE,
  [PRODUCTION_STATUS.REVIEWING]: PRODUCTION_STATUS.CANDIDATE,
  [PRODUCTION_STATUS.DECIDED]: PRODUCTION_STATUS.CANDIDATE,
  [PRODUCTION_STATUS.ON_HOLD]: PRODUCTION_STATUS.CANDIDATE,
  [PRODUCTION_STATUS.ACTIVE]: PRODUCTION_STATUS.ACTIVE,
  [PRODUCTION_STATUS.DONE]: PRODUCTION_STATUS.DONE,
};

export const getProductionKanbanGroupStatus = (recordStatus) => (
  PRODUCTION_KANBAN_STATUS_GROUPS[recordStatus] || PRODUCTION_STATUS.CANDIDATE
);

export const isProductionFocusRecord = (record = {}) => Boolean(getFocusPinnedAt(record));

export const getProductionFocusVideos = (videos, videoUserRecords) => {
  const records = toRecordMap(videoUserRecords);

  return toArray(videos)
    .filter((video) => {
      const record = records[getVideoId(video)];
      if (!hasAnyProductionStatus(record, PRODUCTION_STATUSES)) return false;

      return (
        getProductionKanbanGroupStatus(getProductionStatusFromRecord(record)) === PRODUCTION_STATUS.CANDIDATE
        && isProductionFocusRecord(record)
      );
    })
    .sort((left, right) => {
      const leftPinnedAt = getFocusPinnedAt(records[getVideoId(left)]);
      const rightPinnedAt = getFocusPinnedAt(records[getVideoId(right)]);
      const pinnedOrder = leftPinnedAt.localeCompare(rightPinnedAt);

      return pinnedOrder || Number(right.multiplier || 0) - Number(left.multiplier || 0);
    });
};

const sortProductionVideoGroups = (grouped, videoUserRecords) => {
  const records = toRecordMap(videoUserRecords);

  grouped[PRODUCTION_STATUS.CANDIDATE].sort((a, b) => Number(b.multiplier || 0) - Number(a.multiplier || 0));
  grouped[PRODUCTION_STATUS.ACTIVE].sort((a, b) => {
    const aRecord = records[getVideoId(a)] || {};
    const bRecord = records[getVideoId(b)] || {};
    const aDate = aRecord.targetPublishDate || FALLBACK_TARGET_DATE;
    const bDate = bRecord.targetPublishDate || FALLBACK_TARGET_DATE;
    return aDate.localeCompare(bDate);
  });
  grouped[PRODUCTION_STATUS.DONE].sort((a, b) => {
    const aRecord = records[getVideoId(a)] || {};
    const bRecord = records[getVideoId(b)] || {};
    return (bRecord.uploadedAt || '').localeCompare(aRecord.uploadedAt || '');
  });

  return grouped;
};

export const countGroupedProductionVideos = (groupedVideos = {}) => (
  Object.values(toRecordMap(groupedVideos)).reduce((count, group) => count + toArray(group).length, 0)
);

export const getDiscoveryLinkCandidates = (discoveryLinks) => (
  toArray(discoveryLinks)
    .filter((link) => getDiscoveryLinkStatusValue(link) === 'candidate')
    .sort((left, right) => getItemTimestamp(right) - getItemTimestamp(left))
);

export const groupProductionVideos = (videos, videoUserRecords) => {
  const records = toRecordMap(videoUserRecords);
  const grouped = toArray(videos).reduce((acc, video) => {
    const videoId = getVideoId(video);
    if (!videoId) return acc;

    const record = records[videoId];
    if (!hasAnyProductionStatus(record, PRODUCTION_STATUSES)) return acc;

    const recordStatus = getProductionStatusFromRecord(record);
    const status = getProductionKanbanGroupStatus(recordStatus);
    if (status === PRODUCTION_STATUS.CANDIDATE && isProductionFocusRecord(record)) return acc;
    acc[status].push(video);
    return acc;
  }, createEmptyProductionVideoGroups());

  return sortProductionVideoGroups(grouped, videoUserRecords);
};

export const getScheduledProductionVideos = (videos, draftRecords, videoUserRecords) => (
  toArray(videos)
    .map(video => {
      const record = getProductionRecord(video, draftRecords, videoUserRecords);
      return {
        video,
        date: record.targetPublishDate || '',
      };
    })
    .filter(item => item.date)
    .sort((a, b) => a.date.localeCompare(b.date))
);

export const countDiscoveryRightsWarnings = (discoveryLinkCandidates) => (
  toArray(discoveryLinkCandidates).filter(link => (
    DISCOVERY_RIGHTS_WARNINGS[getDiscoveryLinkRightsStatusValue(link)]
  )).length
);

export const countActiveVideosWithoutDate = (activeVideos, draftRecords, videoUserRecords) => (
  toArray(activeVideos).filter((video) => {
    const record = getProductionRecord(video, draftRecords, videoUserRecords);
    return !record.targetPublishDate;
  }).length
);

export const getProductionSummary = ({
  discoveryLinkCandidates,
  draftRecords,
  focusVideos,
  groupedVideos,
  today,
  videoUserRecords,
}) => {
  const grouped = {
    ...createEmptyProductionVideoGroups(),
    ...toRecordMap(groupedVideos),
  };
  const focusVideoList = toArray(focusVideos);
  const productionVideos = [...Object.values(grouped).flatMap(toArray), ...focusVideoList];
  const scheduledVideos = getScheduledProductionVideos(productionVideos, draftRecords, videoUserRecords);

  return {
    videoCount: countGroupedProductionVideos(grouped) + focusVideoList.length,
    candidateCount: getProductionVideoGroup(grouped, PRODUCTION_STATUS.CANDIDATE).length + focusVideoList.length,
    focusCount: focusVideoList.length,
    activeCount: getProductionVideoGroup(grouped, PRODUCTION_STATUS.ACTIVE).length,
    uploadedCount: getProductionVideoGroup(grouped, PRODUCTION_STATUS.DONE).length,
    nextScheduled: scheduledVideos.find(item => item.date >= today) || scheduledVideos[0],
    overdueCount: scheduledVideos.filter(item => item.date < today).length,
    discoveryRightsWarningCount: countDiscoveryRightsWarnings(discoveryLinkCandidates),
    activeWithoutDate: countActiveVideosWithoutDate(
      grouped[PRODUCTION_STATUS.ACTIVE],
      draftRecords,
      videoUserRecords,
    ),
  };
};

export const getProductionKanbanDataModel = ({
  discoveryLinks,
  draftRecords,
  today = getIsoTodayDate(),
  videoUserRecords,
  videos,
} = {}) => {
  const discoveryLinkCandidates = getDiscoveryLinkCandidates(discoveryLinks);
  const focusVideos = getProductionFocusVideos(videos, videoUserRecords);
  const groupedVideos = groupProductionVideos(videos, videoUserRecords);
  const productionSummary = getProductionSummary({
    discoveryLinkCandidates,
    draftRecords,
    focusVideos,
    groupedVideos,
    today,
    videoUserRecords,
  });

  return {
    discoveryLinkCandidates,
    focusVideos,
    groupedVideos,
    productionSummary,
  };
};
