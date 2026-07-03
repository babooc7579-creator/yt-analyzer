import { useMemo } from 'react';

import { getRadarScore } from '../components/RadarCandidateCard';
import {
  PRODUCTION_STATUS,
  VIDEO_STATUS,
  hasAnyVideoReviewStatus,
  hasProductionStatus,
  hasVideoReviewStatus,
  isRadarHiddenRecord,
} from '../constants/status';

export function useRadarCandidateData({
  videoUserRecords,
  videos,
}) {
  const decisionBuckets = useMemo(() => (
    videos.reduce((buckets, video) => {
      const record = videoUserRecords[video.videoId];
      if (hasVideoReviewStatus(record, VIDEO_STATUS.REVIEWED)) buckets.reviewed.push(video);
      if (hasAnyVideoReviewStatus(record, [VIDEO_STATUS.LEGACY_LATER, VIDEO_STATUS.WATCH_LATER])) buckets.later.push(video);
      if (hasVideoReviewStatus(record, VIDEO_STATUS.EXCLUDED)) buckets.excluded.push(video);
      if (hasProductionStatus(record, PRODUCTION_STATUS.CANDIDATE)) buckets.production.push(video);
      return buckets;
    }, { reviewed: [], later: [], excluded: [], production: [] })
  ), [videos, videoUserRecords]);

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
    Object.values(videoUserRecords).filter(isRadarHiddenRecord).length
  ), [videoUserRecords]);

  const candidates = useMemo(() => (
    [...videos]
      .filter((video) => {
        const record = videoUserRecords[video.videoId];
        return !isRadarHiddenRecord(record);
      })
      .sort((a, b) => getRadarScore(b) - getRadarScore(a))
      .slice(0, 3)
  ), [videos, videoUserRecords]);

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
  };
}
