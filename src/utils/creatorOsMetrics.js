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

export const countScannableChannels = (channels = []) => (
  channels.filter(isChannelScannable).length
);

export const countActiveSelectedChannels = (channels = [], selectedChannelIds = []) => (
  channels.filter(channel => (
    selectedChannelIds.includes(channel.id) && isChannelScannable(channel)
  )).length
);

export const countTtoTtoAssets = (videos = []) => (
  videos.filter(isTtoTtoCandidate).length
);

export const countVisibleScraps = (videos = [], savedVideos = []) => {
  const savedVideoIds = new Set(savedVideos.map(video => video.videoId));
  return videos.filter(video => savedVideoIds.has(video.videoId)).length;
};

export const countLoadedRadarDecisions = (videos = [], videoUserRecords = {}) => (
  videos.filter(video => isRadarHiddenRecord(videoUserRecords[video.videoId])).length
);

export const countOpenRadarCandidates = (videos = [], videoUserRecords = {}) => (
  videos.filter(video => !isRadarHiddenRecord(videoUserRecords[video.videoId])).length
);

export const countProductionCandidates = (savedVideos = [], videoUserRecords = {}) => (
  savedVideos.filter(video => hasProductionStatus(
    videoUserRecords[video.videoId],
    PRODUCTION_STATUS.CANDIDATE,
  )).length
);

export const countDiscoveryCandidates = (discoveryLinks = []) => (
  discoveryLinks.filter((link) => getDiscoveryLinkStatusValue(link) === 'candidate').length
);

export const countDiscoveryRightsWarnings = (discoveryLinks = []) => (
  discoveryLinks.filter((link) => (
    getDiscoveryLinkStatusValue(link) === 'candidate'
    && DISCOVERY_RIGHTS_WARNINGS[getDiscoveryLinkRightsStatusValue(link)]
  )).length
);
