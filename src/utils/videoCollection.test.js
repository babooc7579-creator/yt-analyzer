import { describe, expect, it } from 'vitest';

import { CHANNEL_STATUS } from '../constants/status';
import {
  SCAN_FAILED_MESSAGE,
  SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE,
  STORED_VIDEO_LOAD_FAILED_MESSAGE,
  STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE,
  getScanCompleteMessage,
  getScanCompletionFeedback,
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
    expect(STORED_VIDEO_LOAD_FAILED_MESSAGE).toContain('온라인 저장소(Azure DB)');

    expect(getStoredVideoLoadStartMessage()).toContain('YouTube API');
    expect(getStoredVideoLoadStartMessage()).toContain('온라인 저장소(Azure DB)');

    expect(getStoredVideosLoadedMessage(0)).toContain('온라인 저장소(Azure DB)');
    expect(getStoredVideosLoadedMessage(3)).toContain('3');
    expect(getStoredVideosLoadedMessage(3)).toContain('YouTube API');
    expect(getStoredVideosLoadedMessage(270, 2)).toContain('2페이지');
    expect(getStoredVideosLoadedMessage(270, 2, 850)).toContain('1초 미만');
    expect(getStoredVideosLoadedMessage(270, 2, 2450)).toContain('2.5초');

    const progressMessage = getStoredVideoLoadProgressMessage({
      elapsedMs: 1200,
      pageCount: 2,
      videoCount: 270,
    });
    expect(progressMessage).toContain('2페이지');
    expect(progressMessage).toContain('270개');
    expect(progressMessage).toContain('1.2초');
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
      { newVideosFound: 2, statsRefreshed: 7, ttoTtoCandidates: [{ id: 'a' }] },
      { newVideosFound: 3, statsRefreshed: 8, ttoTtoCandidates: [{ id: 'b' }, { id: 'c' }] },
      {},
    ];

    expect(summarizeScanResults(results)).toEqual({
      totalNew: 5,
      totalStatsRefreshed: 15,
      ttoTtoCount: 3,
    });

    const completeMessage = getScanCompleteMessage(results);
    expect(completeMessage).toContain('5');
    expect(completeMessage).toContain('15');
    expect(completeMessage).toContain('3');
    expect(completeMessage).toContain('온라인 저장소(Azure DB)');

    expect(getScanCompletionFeedback({
      results,
      storageReloadConfirmed: true,
      targetLabel: 'Jinxy',
    })).toEqual({
      detail: '결과를 온라인 저장소(Azure DB)에 반영하고 수집 영상 목록을 다시 불러왔습니다. 채널별 기록과 실행 시각은 최근 수집 상태에서 확인할 수 있습니다.',
      statsText: '신규 영상 5개 · 통계 갱신 15개 · 또터또 후보 3개',
      targetLabel: 'Jinxy',
      title: 'Jinxy 수집 완료',
    });
  });

  it('keeps scan error messages explicit about failed collection work', () => {
    expect(getScanErrorMessage(new Error('Quota exceeded'))).toContain('Quota exceeded');
    expect(getScanErrorMessage()).toContain('YouTube API');
  });
});
