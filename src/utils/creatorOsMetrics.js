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
  isChannelScannable,
  isRadarHiddenRecord,
} from '../constants/status';
import { formatRelativeTime } from './channelScanDisplay';
import { getCloudOnlyTags, getLatestChannelScanDate } from './channels';
import {
  getProductionFocusVideos,
  getProductionKanbanGroupStatus,
} from './productionKanbanData';
import { isTtoTtoCandidate } from './video';

const toArray = (items) => (Array.isArray(items) ? items : []);

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

const toItemObject = (item) => (
  item && typeof item === 'object' ? item : {}
);

const isItemObject = (item) => item && typeof item === 'object';

const getItemId = (item) => toItemObject(item).id;

const getVideoId = (video) => toItemObject(video).videoId;

export const countScannableChannels = (channels = []) => (
  toArray(channels).filter(channel => (
    isItemObject(channel) && isChannelScannable(channel)
  )).length
);

export const countActiveSelectedChannels = (channels = [], selectedChannelIds = []) => {
  const selectedIds = new Set(toArray(selectedChannelIds));

  return toArray(channels).filter(channel => (
    isItemObject(channel) && selectedIds.has(getItemId(channel)) && isChannelScannable(channel)
  )).length;
};

export const countTtoTtoAssets = (videos = []) => (
  toArray(videos).filter(video => isTtoTtoCandidate(toItemObject(video))).length
);

export const countVisibleScraps = (videos = [], savedVideos = []) => {
  const savedVideoIds = new Set(toArray(savedVideos).map(getVideoId).filter(Boolean));
  return toArray(videos).filter(video => savedVideoIds.has(getVideoId(video))).length;
};

export const countLoadedRadarDecisions = (videos = [], videoUserRecords = {}) => {
  const records = toRecordMap(videoUserRecords);

  return toArray(videos).filter(video => {
    const videoId = getVideoId(video);
    return videoId && isRadarHiddenRecord(records[videoId]);
  }).length;
};

export const countOpenRadarCandidates = (videos = [], videoUserRecords = {}) => {
  const records = toRecordMap(videoUserRecords);

  return toArray(videos).filter(video => {
    const videoId = getVideoId(video);
    return videoId && !isRadarHiddenRecord(records[videoId]);
  }).length;
};

export const countProductionCandidates = (savedVideos = [], videoUserRecords = {}) => (
  toArray(savedVideos).filter((video) => {
    const record = toRecordMap(videoUserRecords)[getVideoId(video)];
    return hasAnyProductionStatus(record, PRODUCTION_STATUSES)
      && getProductionKanbanGroupStatus(getProductionStatusFromRecord(record)) === PRODUCTION_STATUS.CANDIDATE;
  }).length
);

export const countProductionFocusCandidates = (savedVideos = [], videoUserRecords = {}) => (
  getProductionFocusVideos(savedVideos, videoUserRecords).length
);

export const countDiscoveryCandidates = (discoveryLinks = []) => (
  toArray(discoveryLinks).filter((link) => getDiscoveryLinkStatusValue(link) === 'candidate').length
);

export const countDiscoveryRightsWarnings = (discoveryLinks = []) => (
  toArray(discoveryLinks).filter((link) => (
    getDiscoveryLinkStatusValue(link) === 'candidate'
    && DISCOVERY_RIGHTS_WARNINGS[getDiscoveryLinkRightsStatusValue(link)]
  )).length
);

export const getCreatorOsMetricsModel = ({
  categories,
  discoveryLinks = [],
  productionSourceVideos,
  savedChannels,
  savedVideos,
  selectedChannelIds,
  videoUserRecords,
  videos,
} = {}) => {
  const latestScannedAt = getLatestChannelScanDate(savedChannels);
  const productionVideos = Array.isArray(productionSourceVideos)
    ? productionSourceVideos
    : savedVideos;

  return {
    activeSelectedChannelCount: countActiveSelectedChannels(savedChannels, selectedChannelIds),
    cloudOnlyTags: getCloudOnlyTags(savedChannels, categories),
    discoveryCandidateCount: countDiscoveryCandidates(discoveryLinks),
    discoveryRightsWarningCount: countDiscoveryRightsWarnings(discoveryLinks),
    latestScanText: latestScannedAt
      ? formatRelativeTime(latestScannedAt)
      : '수집 기록 없음',
    openRadarCandidateCount: countOpenRadarCandidates(videos, videoUserRecords),
    productionCandidateCount: countProductionCandidates(productionVideos, videoUserRecords),
    productionFocusCount: countProductionFocusCandidates(productionVideos, videoUserRecords),
    scannableChannelCount: countScannableChannels(savedChannels),
    ttoTtoAssetCount: countTtoTtoAssets(videos),
    visibleScrapCount: countVisibleScraps(videos, savedVideos),
  };
};
