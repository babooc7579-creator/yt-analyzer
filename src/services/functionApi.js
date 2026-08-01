// Compatibility facade for older imports. New code should import the domain API module directly.
export {
  createChannel,
  createChannelNote,
  createChannelsBulk,
  fetchChannelPreview,
  fetchChannels,
  removeChannel,
  renameTag,
  updateChannel,
} from './channelApi';

export {
  backfillChannelHistory,
  fetchScanLogs,
  scanChannels,
  scanSelectedChannels,
} from './scanApi';

export {
  clearVideoUserRecords,
  fetchStoredVideosByChannelIds,
  fetchVideoUserRecords,
  saveVideoUserRecord,
} from './videoRecordsApi';

export {
  deleteScrapbookVideo,
  fetchScrapbook,
  saveScrapbookVideos,
} from './scrapbookApi';

export {
  createDiscoveryLink,
  deleteDiscoveryLink,
  fetchDiscoveryLinks,
  updateDiscoveryLink,
} from './discoveryLinksApi';

export {
  fetchWorkToolPreferences,
  saveWorkToolPreferences,
} from './workToolPreferencesApi';
