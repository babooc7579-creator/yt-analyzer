import {
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkStatusValue,
  getDiscoveryPlatformLabel,
} from '../constants/discoveryLinks';
import { PRODUCTION_STATUS, hasAnyProductionStatus, PRODUCTION_STATUSES } from '../constants/status';
import { getProductionDiscoveryLinkTitle } from './discoveryLinks';

export const DISCOVERY_LINK_SCRIPT_SOURCE_PREFIX = 'discovery-link:';

const toArray = (items) => (Array.isArray(items) ? items : []);
const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

export const getDiscoveryLinkScriptSourceId = (link = {}) => {
  const linkId = String(link?.id || '').trim();
  return linkId ? `${DISCOVERY_LINK_SCRIPT_SOURCE_PREFIX}${linkId}` : '';
};

export const isDiscoveryLinkScriptSourceId = (sourceId) => (
  String(sourceId || '').startsWith(DISCOVERY_LINK_SCRIPT_SOURCE_PREFIX)
);

export const getDiscoveryLinkIdFromScriptSourceId = (sourceId) => (
  isDiscoveryLinkScriptSourceId(sourceId)
    ? String(sourceId).slice(DISCOVERY_LINK_SCRIPT_SOURCE_PREFIX.length)
    : ''
);

export const getDiscoveryLinkScriptSource = (link = {}) => {
  const videoId = getDiscoveryLinkScriptSourceId(link);
  if (!videoId) return null;

  const sourceHost = getDiscoveryLinkHost(link.url);
  const platformLabel = getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link));

  return {
    channelTitle: `${platformLabel} · ${sourceHost}`,
    discoveryLinkId: String(link.id),
    sourceType: 'discovery_link',
    sourceUrl: String(link.url || ''),
    title: getProductionDiscoveryLinkTitle(link),
    videoId,
  };
};

export const getDiscoveryLinkScriptSources = (links) => (
  toArray(links)
    .filter(link => getDiscoveryLinkStatusValue(link) === 'candidate')
    .map(getDiscoveryLinkScriptSource)
    .filter(Boolean)
);

export const getScriptSourceRecordMap = ({
  discoveryLinks,
  videoUserRecords,
} = {}) => {
  const records = toRecordMap(videoUserRecords);

  return getDiscoveryLinkScriptSources(discoveryLinks).reduce((recordMap, source) => {
    const existingRecord = records[source.videoId];
    if (hasAnyProductionStatus(existingRecord, PRODUCTION_STATUSES)) return recordMap;

    recordMap[source.videoId] = {
      ...(existingRecord || {}),
      status: PRODUCTION_STATUS.CANDIDATE,
      statusIds: [PRODUCTION_STATUS.CANDIDATE],
      videoId: source.videoId,
    };
    return recordMap;
  }, { ...records });
};

export const getDiscoveryLinkScriptSaveUpdates = ({
  sourceId,
  updates,
  videoUserRecords,
} = {}) => {
  const records = toRecordMap(videoUserRecords);
  const existingRecord = records[sourceId];

  if (!isDiscoveryLinkScriptSourceId(sourceId)
    || hasAnyProductionStatus(existingRecord, PRODUCTION_STATUSES)) {
    return updates;
  }

  return {
    status: PRODUCTION_STATUS.CANDIDATE,
    statusIds: [PRODUCTION_STATUS.CANDIDATE],
    ...(updates && typeof updates === 'object' ? updates : {}),
  };
};
