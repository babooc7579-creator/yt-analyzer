import { describe, expect, it } from 'vitest';

import { CHANNEL_STATUS } from '../constants/status';
import {
  SCAN_FAILED_MESSAGE,
  SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE,
  STORED_VIDEO_LOAD_FAILED_MESSAGE,
  STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE,
  getScanCompleteMessage,
  getScanErrorMessage,
  getScanRequestContext,
  getScanStartMessage,
  getSelectedScannableChannelIds,
  getStoredVideoLoadErrorMessage,
  getStoredVideoLoadProgressMessage,
  getStoredVideoLoadStartMessage,
  getStoredVideosLoadedMessage,
  mapStoredVideosToViewModels,
  summarizeScanResults,
} from './videoCollection';

describe('videoCollection utils', () => {
  const channels = [
    { id: 'active-1', status: CHANNEL_STATUS.ACTIVE },
    { id: 'paused-1', status: CHANNEL_STATUS.PAUSED },
    { id: 'discarded-1', status: CHANNEL_STATUS.DISCARDED },
  ];

  it('maps Cloud videos into dashboard view models', () => {
    const mapped = mapStoredVideosToViewModels([{
      id: 'video-1',
      title: 'Stored video',
      uploadDate: '2026-07-01',
      viewCount: 1200,
      likeCount: 120,
      likeRatio: 10,
      multiplier: 2.5,
      channelId: 'channel-1',
      channelTitle: 'Channel',
      duration: '00:59',
      isShorts: true,
    }]);

    expect(mapped[0]).toMatchObject({
      videoId: 'video-1',
      title: 'Stored video',
      upload_date: '2026-07-01',
      channel_id: 'channel-1',
      view_count: 1200,
      like_count: 120,
      like_ratio: 10,
      multiplier: 2.5,
      isShorts: true,
    });
    expect(mapped[0].daysOld).toBeGreaterThanOrEqual(1);
    expect(mapped[0].views_per_day).toBeGreaterThanOrEqual(0);
  });

  it('keeps stored video load messages separate from YouTube API scans', () => {
    expect(STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE).toContain('DB 조회');
    expect(STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE).toContain('새 영상 수집');
    expect(STORED_VIDEO_LOAD_FAILED_MESSAGE).toContain('Cloud DB');

    expect(getStoredVideoLoadStartMessage()).toContain('YouTube API');
    expect(getStoredVideoLoadStartMessage()).toContain('Cloud DB');

    expect(getStoredVideosLoadedMessage(0)).toContain('Cloud DB');
    expect(getStoredVideosLoadedMessage(3)).toContain('3');
    expect(getStoredVideosLoadedMessage(3)).toContain('YouTube API');
    expect(getStoredVideosLoadedMessage(270, 2)).toContain('2페이지');

    const progressMessage = getStoredVideoLoadProgressMessage({
      pageCount: 2,
      videoCount: 270,
    });
    expect(progressMessage).toContain('2페이지');
    expect(progressMessage).toContain('270개');
    expect(progressMessage).toContain('전체 조회가 끝난 뒤 한 번에 표시');

    expect(getStoredVideoLoadErrorMessage(new Error('Network down'))).toContain('Network down');
    expect(getStoredVideoLoadErrorMessage()).toContain('YouTube API');
  });

  it('filters selected scan targets to active channels only', () => {
    expect(getSelectedScannableChannelIds(channels, [
      'active-1',
      'paused-1',
      'discarded-1',
      'missing',
    ])).toEqual(['active-1']);
  });

  it('builds scan request context for selected, tag, and all-channel scans', () => {
    expect(getScanRequestContext({
      tag: '',
      selectedChannelIds: ['active-1', 'paused-1'],
      savedChannels: channels,
    })).toEqual({
      scanSelectedChannels: true,
      channelIdsForScan: ['active-1'],
      scanningTag: 'SELECTED',
    });

    expect(getScanRequestContext({
      tag: 'history',
      selectedChannelIds: ['active-1'],
      savedChannels: channels,
    })).toEqual({
      scanSelectedChannels: false,
      channelIdsForScan: [],
      scanningTag: 'history',
    });

    expect(getScanRequestContext({
      selectedChannelIds: [],
      savedChannels: channels,
    })).toEqual({
      scanSelectedChannels: false,
      channelIdsForScan: [],
      scanningTag: 'ALL',
    });
  });

  it('creates scan start messages that identify YouTube API work', () => {
    expect(SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE).toContain('운영중');
    expect(SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE).toContain('새 영상 수집');
    expect(SCAN_FAILED_MESSAGE).toContain('스캔');

    expect(getScanStartMessage({
      scanSelectedChannels: true,
      channelIdsForScan: ['active-1', 'active-2'],
      tag: '',
    })).toContain('YouTube API');

    expect(getScanStartMessage({
      scanSelectedChannels: false,
      channelIdsForScan: [],
      tag: 'history',
    })).toContain('history');

    expect(getScanStartMessage({
      scanSelectedChannels: false,
      channelIdsForScan: [],
      tag: '',
    })).toContain('YouTube API');
  });

  it('summarizes scan results and scan completion notices', () => {
    const results = [
      { newVideosFound: 2, ttoTtoCandidates: [{ id: 'a' }] },
      { newVideosFound: 3, ttoTtoCandidates: [{ id: 'b' }, { id: 'c' }] },
      {},
    ];

    expect(summarizeScanResults(results)).toEqual({
      totalNew: 5,
      ttoTtoCount: 3,
    });

    const completeMessage = getScanCompleteMessage(results);
    expect(completeMessage).toContain('5');
    expect(completeMessage).toContain('3');
    expect(completeMessage).toContain('Cloud DB');
  });

  it('keeps scan error messages explicit about failed collection work', () => {
    expect(getScanErrorMessage(new Error('Quota exceeded'))).toContain('Quota exceeded');
    expect(getScanErrorMessage()).toContain('YouTube API');
  });
});
