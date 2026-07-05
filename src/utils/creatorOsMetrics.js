import {
  DISCOVERY_RIGHTS_WARNINGS,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusValue,
} from '../constants/discoveryLinks';
import {
  PRODUCTION_STATUS,
  hasProductionStatus,
  isChannelScannable,
  isRadarHiddenRecord,
} from '../constants/status';
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
  toArray(savedVideos).filter(video => hasProductionStatus(
    toRecordMap(videoUserRecords)[getVideoId(video)],
    PRODUCTION_STATUS.CANDIDATE,
  )).length
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
