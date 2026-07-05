import {
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusValue,
} from '../constants/discoveryLinks';
import { getProductionStatusFromRecord, PRODUCTION_STATUS } from '../constants/status';

const FALLBACK_TARGET_DATE = '9999-12-31';

const getItemTimestamp = (item) => new Date(item.updatedAt || item.createdAt || 0).getTime();

const getProductionRecord = (video, draftRecords, videoUserRecords) => (
  draftRecords[video.videoId] || videoUserRecords[video.videoId] || {}
);

const createEmptyProductionVideoGroups = () => ({
  [PRODUCTION_STATUS.CANDIDATE]: [],
  [PRODUCTION_STATUS.ACTIVE]: [],
  [PRODUCTION_STATUS.DONE]: [],
});

const getProductionGroupStatus = (recordStatus, grouped) => (
  grouped[recordStatus] ? recordStatus : PRODUCTION_STATUS.CANDIDATE
);

const sortProductionVideoGroups = (grouped, videoUserRecords) => {
  grouped[PRODUCTION_STATUS.CANDIDATE].sort((a, b) => Number(b.multiplier || 0) - Number(a.multiplier || 0));
  grouped[PRODUCTION_STATUS.ACTIVE].sort((a, b) => {
    const aRecord = videoUserRecords[a.videoId] || {};
    const bRecord = videoUserRecords[b.videoId] || {};
    const aDate = aRecord.targetPublishDate || FALLBACK_TARGET_DATE;
    const bDate = bRecord.targetPublishDate || FALLBACK_TARGET_DATE;
    return aDate.localeCompare(bDate);
  });
  grouped[PRODUCTION_STATUS.DONE].sort((a, b) => {
    const aRecord = videoUserRecords[a.videoId] || {};
    const bRecord = videoUserRecords[b.videoId] || {};
    return (bRecord.uploadedAt || '').localeCompare(aRecord.uploadedAt || '');
  });

  return grouped;
};

export const getDiscoveryLinkCandidates = (discoveryLinks) => (
  discoveryLinks
    .filter((link) => getDiscoveryLinkStatusValue(link) === 'candidate')
    .sort((left, right) => getItemTimestamp(right) - getItemTimestamp(left))
);

export const groupProductionVideos = (videos, videoUserRecords) => {
  const grouped = videos.reduce((acc, video) => {
    const recordStatus = getProductionStatusFromRecord(videoUserRecords[video.videoId]);
    const status = getProductionGroupStatus(recordStatus, acc);
    acc[status].push(video);
    return acc;
  }, createEmptyProductionVideoGroups());

  return sortProductionVideoGroups(grouped, videoUserRecords);
};

export const getScheduledProductionVideos = (videos, draftRecords, videoUserRecords) => (
  videos
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
  discoveryLinkCandidates.filter(link => (
    DISCOVERY_RIGHTS_WARNINGS[getDiscoveryLinkRightsStatusValue(link)]
  )).length
);

export const countActiveVideosWithoutDate = (activeVideos, draftRecords, videoUserRecords) => (
  activeVideos.filter((video) => {
    const record = getProductionRecord(video, draftRecords, videoUserRecords);
    return !record.targetPublishDate;
  }).length
);

export const getProductionSummary = ({
  discoveryLinkCandidates,
  draftRecords,
  groupedVideos,
  today,
  videoUserRecords,
  videos,
}) => {
  const scheduledVideos = getScheduledProductionVideos(videos, draftRecords, videoUserRecords);

  return {
    candidateCount: groupedVideos[PRODUCTION_STATUS.CANDIDATE].length,
    activeCount: groupedVideos[PRODUCTION_STATUS.ACTIVE].length,
    uploadedCount: groupedVideos[PRODUCTION_STATUS.DONE].length,
    nextScheduled: scheduledVideos.find(item => item.date >= today) || scheduledVideos[0],
    overdueCount: scheduledVideos.filter(item => item.date < today).length,
    discoveryRightsWarningCount: countDiscoveryRightsWarnings(discoveryLinkCandidates),
    activeWithoutDate: countActiveVideosWithoutDate(
      groupedVideos[PRODUCTION_STATUS.ACTIVE],
      draftRecords,
      videoUserRecords,
    ),
  };
};
