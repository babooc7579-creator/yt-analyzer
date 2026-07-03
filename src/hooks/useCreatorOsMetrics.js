import { useMemo } from 'react';
import { DISCOVERY_RIGHTS_WARNINGS } from '../constants/discoveryLinks';
import { PRODUCTION_STATUS, getProductionStatusFromRecord, isChannelScannable, isRadarHiddenRecord } from '../constants/status';
import { formatRelativeTime } from '../utils/channelScanDisplay';
import { getCloudOnlyTags, getLatestChannelScanDate } from '../utils/channels';
import { isTtoTtoCandidate } from '../utils/video';

export function useCreatorOsMetrics({
  categories,
  discoveryLinks = [],
  savedChannels,
  savedVideos,
  selectedChannelIds,
  videoUserRecords,
  videos,
}) {
  const latestScannedAt = useMemo(() => (
    getLatestChannelScanDate(savedChannels)
  ), [savedChannels]);

  const latestScanText = latestScannedAt
    ? formatRelativeTime(latestScannedAt)
    : '수집 기록 없음';

  const scannableChannelCount = useMemo(() => (
    savedChannels.filter(isChannelScannable).length
  ), [savedChannels]);

  const activeSelectedChannelCount = useMemo(() => (
    savedChannels.filter(channel => (
      selectedChannelIds.includes(channel.id) && isChannelScannable(channel)
    )).length
  ), [savedChannels, selectedChannelIds]);

  const cloudOnlyTags = useMemo(() => (
    getCloudOnlyTags(savedChannels, categories)
  ), [savedChannels, categories]);

  const ttoTtoAssetCount = useMemo(() => (
    videos.filter(isTtoTtoCandidate).length
  ), [videos]);

  const visibleScrapCount = useMemo(() => {
    const savedVideoIds = new Set(savedVideos.map(video => video.videoId));
    return videos.filter(video => savedVideoIds.has(video.videoId)).length;
  }, [savedVideos, videos]);

  const loadedDecisionCount = useMemo(() => (
    videos.filter(video => (
      isRadarHiddenRecord(videoUserRecords[video.videoId])
    )).length
  ), [videoUserRecords, videos]);

  const openRadarCandidateCount = Math.max(videos.length - loadedDecisionCount, 0);

  const productionCandidateCount = useMemo(() => (
    savedVideos.filter(video => (
      getProductionStatusFromRecord(videoUserRecords[video.videoId]) === PRODUCTION_STATUS.CANDIDATE
    )).length
  ), [savedVideos, videoUserRecords]);

  const discoveryCandidateCount = useMemo(() => (
    discoveryLinks.filter((link) => (link.status || '') === 'candidate').length
  ), [discoveryLinks]);

  const discoveryRightsWarningCount = useMemo(() => (
    discoveryLinks.filter((link) => (
      (link.status || '') === 'candidate'
      && DISCOVERY_RIGHTS_WARNINGS[link.rightsStatus || 'unknown']
    )).length
  ), [discoveryLinks]);

  return {
    activeSelectedChannelCount,
    cloudOnlyTags,
    discoveryCandidateCount,
    discoveryRightsWarningCount,
    latestScanText,
    openRadarCandidateCount,
    productionCandidateCount,
    scannableChannelCount,
    ttoTtoAssetCount,
    visibleScrapCount,
  };
}
