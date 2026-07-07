import { describe, expect, it } from 'vitest';

import {
  clearVideoUserRecords,
  createChannel,
  createChannelNote,
  createChannelsBulk,
  createDiscoveryLink,
  deleteDiscoveryLink,
  deleteScrapbookVideo,
  fetchChannelPreview,
  fetchChannels,
  fetchDiscoveryLinks,
  fetchScrapbook,
  fetchStoredVideosByChannelIds,
  fetchVideoUserRecords,
  removeChannel,
  renameTag,
  saveScrapbookVideos,
  saveVideoUserRecord,
  scanChannels,
  scanSelectedChannels,
  updateChannel,
  updateDiscoveryLink,
} from './functionApi';
import * as channelApi from './channelApi';
import * as discoveryLinksApi from './discoveryLinksApi';
import * as scanApi from './scanApi';
import * as scrapbookApi from './scrapbookApi';
import * as videoRecordsApi from './videoRecordsApi';

describe('functionApi compatibility exports', () => {
  it('keeps channel API exports available through the legacy facade', () => {
    expect(fetchChannels).toBe(channelApi.fetchChannels);
    expect(fetchChannelPreview).toBe(channelApi.fetchChannelPreview);
    expect(createChannel).toBe(channelApi.createChannel);
    expect(createChannelsBulk).toBe(channelApi.createChannelsBulk);
    expect(removeChannel).toBe(channelApi.removeChannel);
    expect(updateChannel).toBe(channelApi.updateChannel);
    expect(createChannelNote).toBe(channelApi.createChannelNote);
    expect(renameTag).toBe(channelApi.renameTag);
  });

  it('keeps scan API exports available through the legacy facade', () => {
    expect(scanChannels).toBe(scanApi.scanChannels);
    expect(scanSelectedChannels).toBe(scanApi.scanSelectedChannels);
  });

  it('keeps video record API exports available through the legacy facade', () => {
    expect(clearVideoUserRecords).toBe(videoRecordsApi.clearVideoUserRecords);
    expect(fetchStoredVideosByChannelIds).toBe(videoRecordsApi.fetchStoredVideosByChannelIds);
    expect(fetchVideoUserRecords).toBe(videoRecordsApi.fetchVideoUserRecords);
    expect(saveVideoUserRecord).toBe(videoRecordsApi.saveVideoUserRecord);
  });

  it('keeps scrapbook API exports available through the legacy facade', () => {
    expect(deleteScrapbookVideo).toBe(scrapbookApi.deleteScrapbookVideo);
    expect(fetchScrapbook).toBe(scrapbookApi.fetchScrapbook);
    expect(saveScrapbookVideos).toBe(scrapbookApi.saveScrapbookVideos);
  });

  it('keeps discovery link API exports available through the legacy facade', () => {
    expect(createDiscoveryLink).toBe(discoveryLinksApi.createDiscoveryLink);
    expect(deleteDiscoveryLink).toBe(discoveryLinksApi.deleteDiscoveryLink);
    expect(fetchDiscoveryLinks).toBe(discoveryLinksApi.fetchDiscoveryLinks);
    expect(updateDiscoveryLink).toBe(discoveryLinksApi.updateDiscoveryLink);
  });
});
