import { useMemo } from 'react';

import {
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusValue,
} from '../constants/discoveryLinks';
import { getProductionStatusFromRecord, PRODUCTION_STATUS } from '../constants/status';
import { getIsoTodayDate } from '../utils/dates';

export function useProductionKanbanData({
  discoveryLinks,
  draftRecords,
  videoUserRecords,
  videos,
}) {
  const discoveryLinkCandidates = useMemo(() => (
    discoveryLinks
      .filter((link) => getDiscoveryLinkStatusValue(link) === 'candidate')
      .sort((left, right) => (
        new Date(right.updatedAt || right.createdAt || 0).getTime()
        - new Date(left.updatedAt || left.createdAt || 0).getTime()
      ))
  ), [discoveryLinks]);

  const groupedVideos = useMemo(() => {
    const grouped = videos.reduce((acc, video) => {
      const recordStatus = getProductionStatusFromRecord(videoUserRecords[video.videoId]);
      const status = acc[recordStatus] ? recordStatus : PRODUCTION_STATUS.CANDIDATE;
      acc[status].push(video);
      return acc;
    }, {
      [PRODUCTION_STATUS.CANDIDATE]: [],
      [PRODUCTION_STATUS.ACTIVE]: [],
      [PRODUCTION_STATUS.DONE]: [],
    });

    grouped[PRODUCTION_STATUS.CANDIDATE].sort((a, b) => Number(b.multiplier || 0) - Number(a.multiplier || 0));
    grouped[PRODUCTION_STATUS.ACTIVE].sort((a, b) => {
      const aRecord = videoUserRecords[a.videoId] || {};
      const bRecord = videoUserRecords[b.videoId] || {};
      const aDate = aRecord.targetPublishDate || '9999-12-31';
      const bDate = bRecord.targetPublishDate || '9999-12-31';
      return aDate.localeCompare(bDate);
    });
    grouped[PRODUCTION_STATUS.DONE].sort((a, b) => {
      const aRecord = videoUserRecords[a.videoId] || {};
      const bRecord = videoUserRecords[b.videoId] || {};
      return (bRecord.uploadedAt || '').localeCompare(aRecord.uploadedAt || '');
    });

    return grouped;
  }, [videos, videoUserRecords]);

  const productionSummary = useMemo(() => {
    const today = getIsoTodayDate();
    const scheduledVideos = videos
      .map(video => {
        const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};
        return {
          video,
          date: record.targetPublishDate || '',
        };
      })
      .filter(item => item.date)
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      candidateCount: groupedVideos[PRODUCTION_STATUS.CANDIDATE].length,
      activeCount: groupedVideos[PRODUCTION_STATUS.ACTIVE].length,
      uploadedCount: groupedVideos[PRODUCTION_STATUS.DONE].length,
      nextScheduled: scheduledVideos.find(item => item.date >= today) || scheduledVideos[0],
      overdueCount: scheduledVideos.filter(item => item.date < today).length,
      discoveryRightsWarningCount: discoveryLinkCandidates.filter(link => (
        DISCOVERY_RIGHTS_WARNINGS[getDiscoveryLinkRightsStatusValue(link)]
      )).length,
      activeWithoutDate: groupedVideos[PRODUCTION_STATUS.ACTIVE].filter((video) => {
        const record = draftRecords[video.videoId] || videoUserRecords[video.videoId] || {};
        return !record.targetPublishDate;
      }).length,
    };
  }, [discoveryLinkCandidates, draftRecords, groupedVideos, videoUserRecords, videos]);

  return {
    discoveryLinkCandidates,
    groupedVideos,
    productionSummary,
  };
}
