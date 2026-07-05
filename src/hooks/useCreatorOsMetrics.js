import { useMemo } from 'react';
import { formatRelativeTime } from '../utils/channelScanDisplay';
import { getCloudOnlyTags, getLatestChannelScanDate } from '../utils/channels';
import {
  countActiveSelectedChannels,
  countDiscoveryCandidates,
  countDiscoveryRightsWarnings,
  countLoadedRadarDecisions,
  countProductionCandidates,
  countScannableChannels,
  countTtoTtoAssets,
  countVisibleScraps,
} from '../utils/creatorOsMetrics';

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
    countScannableChannels(savedChannels)
  ), [savedChannels]);

  const activeSelectedChannelCount = useMemo(() => (
    countActiveSelectedChannels(savedChannels, selectedChannelIds)
  ), [savedChannels, selectedChannelIds]);

  const cloudOnlyTags = useMemo(() => (
    getCloudOnlyTags(savedChannels, categories)
  ), [savedChannels, categories]);

  const ttoTtoAssetCount = useMemo(() => (
    countTtoTtoAssets(videos)
  ), [videos]);

  const visibleScrapCount = useMemo(() => (
    countVisibleScraps(videos, savedVideos)
  ), [savedVideos, videos]);

  const loadedDecisionCount = useMemo(() => (
    countLoadedRadarDecisions(videos, videoUserRecords)
  ), [videoUserRecords, videos]);

  const openRadarCandidateCount = Math.max(videos.length - loadedDecisionCount, 0);

  const productionCandidateCount = useMemo(() => (
    countProductionCandidates(savedVideos, videoUserRecords)
  ), [savedVideos, videoUserRecords]);

  const discoveryCandidateCount = useMemo(() => (
    countDiscoveryCandidates(discoveryLinks)
  ), [discoveryLinks]);

  const discoveryRightsWarningCount = useMemo(() => (
    countDiscoveryRightsWarnings(discoveryLinks)
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
