import { useMemo } from 'react';

import {
  PRODUCTION_STATUS,
  VIDEO_STATUS,
  hasAnyVideoReviewStatus,
  hasProductionStatus,
  hasVideoReviewStatus,
  isRadarHiddenRecord,
} from '../constants/status';
import {
  RADAR_PRIORITY_SCORE_THRESHOLD,
  RADAR_TODAY_CANDIDATE_LIMIT,
  getRadarScore,
} from '../utils/radarCandidates';

const toVideoList = (videos) => (
  Array.isArray(videos) ? videos.filter(video => video && typeof video === 'object') : []
);

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

export function useRadarCandidateData({
  videoUserRecords,
  videos,
}) {
  const videoList = useMemo(() => toVideoList(videos), [videos]);
  const userRecordMap = useMemo(() => toRecordMap(videoUserRecords), [videoUserRecords]);

  const decisionBuckets = useMemo(() => (
    videoList.reduce((buckets, video) => {
      const record = userRecordMap[video.videoId];
      if (hasVideoReviewStatus(record, VIDEO_STATUS.REVIEWED)) buckets.reviewed.push(video);
      if (hasAnyVideoReviewStatus(record, [VIDEO_STATUS.LEGACY_LATER, VIDEO_STATUS.WATCH_LATER])) buckets.later.push(video);
      if (hasVideoReviewStatus(record, VIDEO_STATUS.EXCLUDED)) buckets.excluded.push(video);
      if (hasProductionStatus(record, PRODUCTION_STATUS.CANDIDATE)) buckets.production.push(video);
      return buckets;
    }, { reviewed: [], later: [], excluded: [], production: [] })
  ), [userRecordMap, videoList]);

  const decisionSummary = {
    reviewed: decisionBuckets.reviewed.length,
    later: decisionBuckets.later.length,
    excluded: decisionBuckets.excluded.length,
    production: decisionBuckets.production.length,
  };

  const loadedDecisionCount = decisionSummary.reviewed
    + decisionSummary.later
    + decisionSummary.excluded
    + decisionSummary.production;

  const allDecisionCount = useMemo(() => (
    Object.values(userRecordMap).filter(isRadarHiddenRecord).length
  ), [userRecordMap]);

  const candidatePool = useMemo(() => (
    [...videoList]
      .filter((video) => {
        const record = userRecordMap[video.videoId];
        return !isRadarHiddenRecord(record);
      })
      .sort((a, b) => getRadarScore(b) - getRadarScore(a))
  ), [userRecordMap, videoList]);

  const candidates = useMemo(() => (
    candidatePool.slice(0, RADAR_TODAY_CANDIDATE_LIMIT)
  ), [candidatePool]);

  const queueSummary = useMemo(() => ({
    candidateLimit: RADAR_TODAY_CANDIDATE_LIMIT,
    hiddenDecisionCount: allDecisionCount,
    highPriorityCount: candidatePool.filter((video) => (
      getRadarScore(video) >= RADAR_PRIORITY_SCORE_THRESHOLD
    )).length,
    shownCandidateCount: candidates.length,
    visibleQueueCount: candidatePool.length,
  }), [allDecisionCount, candidatePool, candidates]);

  const decisionGroups = [
    { key: 'reviewed', label: '봤음', videos: decisionBuckets.reviewed },
    { key: 'later', label: '나중에 보기', videos: decisionBuckets.later },
    { key: 'production', label: '제작 후보', videos: decisionBuckets.production },
    { key: 'excluded', label: '제외', videos: decisionBuckets.excluded },
  ];

  return {
    allDecisionCount,
    candidates,
    decisionGroups,
    decisionSummary,
    loadedDecisionCount,
    queueSummary,
  };
}
