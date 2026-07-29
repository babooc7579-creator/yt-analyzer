import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  backfillChannelHistoryMock,
  fetchAllStoredVideosByChannelIdsMock,
  scanChannelsMock,
  scanSelectedChannelsMock,
} = vi.hoisted(() => ({
  backfillChannelHistoryMock: vi.fn(),
  fetchAllStoredVideosByChannelIdsMock: vi.fn(),
  scanChannelsMock: vi.fn(),
  scanSelectedChannelsMock: vi.fn(),
}));

vi.mock('../services/videoRecordsApi', () => ({
  fetchAllStoredVideosByChannelIds: fetchAllStoredVideosByChannelIdsMock,
}));

vi.mock('../services/scanApi', () => ({
  backfillChannelHistory: backfillChannelHistoryMock,
  scanChannels: scanChannelsMock,
  scanSelectedChannels: scanSelectedChannelsMock,
}));

import { CHANNEL_STATUS } from '../constants/status';
import { backfillChannelHistory, scanChannels, scanSelectedChannels } from '../services/scanApi';
import { fetchAllStoredVideosByChannelIds } from '../services/videoRecordsApi';
import {
  SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE,
  STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE,
} from '../utils/videoCollection';
import { useVideoCollectionActions } from './useVideoCollectionActions';

const storedVideo = {
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
};

const createDeps = (overrides = {}) => ({
  clearCheckedVideos: vi.fn(),
  loadChannelsFromCloud: vi.fn(() => Promise.resolve()),
  savedChannels: [
    { id: 'active-1', status: CHANNEL_STATUS.ACTIVE, title: 'Jinxy' },
    { id: 'paused-1', status: CHANNEL_STATUS.PAUSED },
  ],
  selectedChannelIds: ['active-1'],
  setActiveTab: vi.fn(),
  setError: vi.fn(),
  setIsScanning: vi.fn(),
  setLoading: vi.fn(),
  setProgressMsg: vi.fn(),
  setScanningTag: vi.fn(),
  setVideos: vi.fn(),
  ...overrides,
});

describe('useVideoCollectionActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    fetchAllStoredVideosByChannelIdsMock.mockResolvedValue({
      success: true,
      videos: [storedVideo],
      pageCount: 1,
    });
    scanChannelsMock.mockResolvedValue({
      success: true,
      results: [{ newVideosFound: 1, ttoTtoCandidates: [] }],
    });
    scanSelectedChannelsMock.mockResolvedValue({
      success: true,
      results: [{ newVideosFound: 2, ttoTtoCandidates: [{ id: 'candidate-1' }] }],
    });
    backfillChannelHistoryMock.mockResolvedValue({
      success: true,
      result: {
        channelId: 'active-1',
        inspectedVideos: 100,
        savedVideosThisRun: 30,
        savedVideosTotal: 280,
        estimatedMissingVideos: 120,
      },
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('does not load stored videos when no channel is selected', async () => {
    const deps = createDeps({ selectedChannelIds: [] });
    const actions = useVideoCollectionActions(deps);

    const result = await actions.loadStoredVideosForSelectedChannels();

    expect(result).toEqual({ success: false, videoCount: 0 });
    expect(deps.setError).toHaveBeenCalledWith(STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE);
    expect(fetchAllStoredVideosByChannelIds).not.toHaveBeenCalled();
    expect(deps.setLoading).not.toHaveBeenCalled();
    expect(scanChannels).not.toHaveBeenCalled();
    expect(scanSelectedChannels).not.toHaveBeenCalled();
  });

  it('loads stored videos through the DB lookup service without starting a scan', async () => {
    const deps = createDeps({ selectedChannelIds: ['active-1', 'active-2'] });
    const actions = useVideoCollectionActions(deps);

    const result = await actions.loadStoredVideosForSelectedChannels();

    expect(result).toEqual({ success: true, videoCount: 1 });
    expect(deps.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(deps.setError).toHaveBeenCalledWith('');
    expect(deps.setVideos).toHaveBeenNthCalledWith(1, []);
    expect(deps.clearCheckedVideos).toHaveBeenCalledTimes(1);
    expect(deps.setActiveTab).toHaveBeenCalledWith('dashboard');
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '온라인 저장소(Azure DB)에 보관된 수집 영상 정보만 불러오는 중입니다. YouTube API를 새로 호출하지 않습니다.',
    );
    expect(fetchAllStoredVideosByChannelIds).toHaveBeenCalledWith(
      ['active-1', 'active-2'],
      { onPage: expect.any(Function) },
    );
    expect(scanChannels).not.toHaveBeenCalled();
    expect(scanSelectedChannels).not.toHaveBeenCalled();
    expect(deps.setVideos).toHaveBeenNthCalledWith(2, [
      expect.objectContaining({
        videoId: 'video-1',
        title: 'Stored video',
        channel_id: 'channel-1',
      }),
    ]);
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '온라인 저장소(Azure DB) 조회 완료 · 1초 미만 경과: 수집된 영상 정보 1개를 불러왔습니다. 새 YouTube API 호출은 없었습니다.',
    );
    expect(deps.setLoading).toHaveBeenLastCalledWith(false);

    vi.runOnlyPendingTimers();

    expect(deps.setProgressMsg).toHaveBeenLastCalledWith('');
  });

  it('keeps stored video load failures explicit about DB lookup failure', async () => {
    fetchAllStoredVideosByChannelIdsMock.mockResolvedValueOnce({
      success: false,
      error: 'Cloud unavailable',
    });
    const deps = createDeps();
    const actions = useVideoCollectionActions(deps);

    const result = await actions.loadStoredVideosForSelectedChannels();

    expect(result).toEqual({ success: false, videoCount: 0 });
    expect(deps.setError).toHaveBeenCalledWith(
      'Cloud unavailable 온라인 저장소(Azure DB) 조회를 완료하지 못했습니다. 새 YouTube API 호출이나 새 영상 수집은 실행하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(deps.setProgressMsg).toHaveBeenLastCalledWith('');
    expect(deps.setLoading).toHaveBeenLastCalledWith(false);
    expect(scanChannels).not.toHaveBeenCalled();
    expect(scanSelectedChannels).not.toHaveBeenCalled();
  });

  it('runs selected-channel scans only for active selected channels and then refreshes stored videos', async () => {
    const deps = createDeps({
      selectedChannelIds: ['active-1', 'paused-1'],
    });
    const actions = useVideoCollectionActions(deps);

    const result = await actions.handleManualScan();

    expect(scanSelectedChannels).toHaveBeenCalledWith(['active-1']);
    expect(scanChannels).not.toHaveBeenCalled();
    expect(deps.setIsScanning).toHaveBeenNthCalledWith(1, true);
    expect(deps.setScanningTag).toHaveBeenNthCalledWith(1, 'SELECTED');
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '선택 채널 1개 새 영상 수집 중입니다. YouTube API 호출이 발생하며 수집 영상 목록 불러오기와 다른 작업입니다.',
    );
    expect(deps.loadChannelsFromCloud).toHaveBeenCalledTimes(1);
    expect(fetchAllStoredVideosByChannelIds).toHaveBeenCalledWith(
      ['active-1', 'paused-1'],
      { onPage: expect.any(Function) },
    );
    expect(deps.setIsScanning).toHaveBeenLastCalledWith(false);
    expect(deps.setScanningTag).toHaveBeenLastCalledWith(null);
    expect(result).toMatchObject({
      success: true,
      feedback: {
        title: 'Jinxy 수집 완료',
        statsText: '신규 영상 2개 · 통계 갱신 0개 · 또터또 후보 1개',
      },
    });
  });

  it('blocks selected-channel scans when no selected channel is scannable', async () => {
    const deps = createDeps({
      selectedChannelIds: ['paused-1'],
    });
    const actions = useVideoCollectionActions(deps);

    await actions.handleManualScan();

    expect(deps.setError).toHaveBeenCalledWith(SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE);
    expect(scanSelectedChannels).not.toHaveBeenCalled();
    expect(scanChannels).not.toHaveBeenCalled();
    expect(fetchAllStoredVideosByChannelIds).not.toHaveBeenCalled();
  });

  it('blocks manual scans when no channel is explicitly selected', async () => {
    const deps = createDeps({
      selectedChannelIds: [],
    });
    const actions = useVideoCollectionActions(deps);

    await actions.handleManualScan();

    expect(deps.setError).toHaveBeenCalledWith(SCAN_NO_SCANNABLE_CHANNEL_SELECTED_MESSAGE);
    expect(scanSelectedChannels).not.toHaveBeenCalled();
    expect(scanChannels).not.toHaveBeenCalled();
    expect(fetchAllStoredVideosByChannelIds).not.toHaveBeenCalled();
  });

  it('uses tag scans for tag requests even when channels are selected', async () => {
    const deps = createDeps({
      selectedChannelIds: ['active-1'],
    });
    const actions = useVideoCollectionActions(deps);

    await actions.handleTagScan('history');

    expect(scanChannels).toHaveBeenCalledWith({ tag: 'history' });
    expect(scanSelectedChannels).not.toHaveBeenCalled();
    expect(deps.setScanningTag).toHaveBeenNthCalledWith(1, 'history');
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      "'history' 태그 채널 새 영상 수집 중입니다. YouTube API 호출이 발생하며 수집 영상 목록 불러오기와 다른 작업입니다.",
    );
    expect(deps.loadChannelsFromCloud).toHaveBeenCalledTimes(1);
    expect(fetchAllStoredVideosByChannelIds).toHaveBeenCalledWith(
      ['active-1'],
      { onPage: expect.any(Function) },
    );
  });

  it('reports paged DB lookup progress without exposing partial video results', async () => {
    fetchAllStoredVideosByChannelIdsMock.mockImplementationOnce(async (_channelIds, { onPage }) => {
      onPage({ pageCount: 1, videoCount: 200 });
      onPage({ pageCount: 2, videoCount: 270 });
      return {
        success: true,
        videos: [storedVideo],
        pageCount: 2,
      };
    });
    const deps = createDeps();
    const actions = useVideoCollectionActions(deps);

    await actions.loadStoredVideosForSelectedChannels();

    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '온라인 저장소(Azure DB) 수집 영상 조회 중: 1페이지, 200개를 확인했습니다 · 1초 미만 경과. 전체 조회가 끝난 뒤 한 번에 표시하며 YouTube API는 호출하지 않습니다.',
    );
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '온라인 저장소(Azure DB) 수집 영상 조회 중: 2페이지, 270개를 확인했습니다 · 1초 미만 경과. 전체 조회가 끝난 뒤 한 번에 표시하며 YouTube API는 호출하지 않습니다.',
    );
    expect(deps.setVideos).toHaveBeenCalledTimes(2);
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '온라인 저장소(Azure DB) 조회 완료 · 1초 미만 경과: 수집된 영상 정보 1개를 2페이지에서 모아 불러왔습니다. 새 YouTube API 호출은 없었습니다.',
    );
  });

  it('keeps scan failures separate from stored-video DB lookup failures', async () => {
    scanSelectedChannelsMock.mockResolvedValueOnce({
      success: false,
      error: 'Quota exceeded',
    });
    const deps = createDeps();
    const actions = useVideoCollectionActions(deps);

    await actions.handleManualScan();

    expect(deps.setError).toHaveBeenCalledWith(
      '새 영상 수집 실패: Quota exceeded YouTube API 호출 결과가 정상 저장되었는지 확인하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(deps.loadChannelsFromCloud).not.toHaveBeenCalled();
    expect(fetchAllStoredVideosByChannelIds).not.toHaveBeenCalled();
    expect(deps.setIsScanning).toHaveBeenLastCalledWith(false);
    expect(deps.setScanningTag).toHaveBeenLastCalledWith(null);
  });

  it('runs one capped historical backfill and refreshes Cloud channel progress', async () => {
    const deps = createDeps();
    const actions = useVideoCollectionActions(deps);

    const response = await actions.runHistoricalBackfill('active-1', '테스트 채널');

    expect(backfillChannelHistory).toHaveBeenCalledWith('active-1', { maxPages: 10 });
    expect(deps.setScanningTag).toHaveBeenNthCalledWith(1, 'BACKFILL:active-1');
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '테스트 채널의 공개 업로드 목록을 끝까지 확인하고 있습니다. 이번 실행은 최대 500개까지 진행하며 온라인 저장소(Azure DB)에 없는 영상만 저장합니다.',
    );
    expect(deps.loadChannelsFromCloud).toHaveBeenCalledTimes(1);
    expect(response).toMatchObject({ success: true });
    expect(response.message).toContain('다시 실행하면 현재 위치부터 이어갑니다');
    expect(deps.setIsScanning).toHaveBeenLastCalledWith(false);
    expect(deps.setScanningTag).toHaveBeenLastCalledWith(null);
  });

  it('reports a historical backfill failure without claiming completion', async () => {
    backfillChannelHistoryMock.mockResolvedValueOnce({
      success: false,
      error: 'quota exceeded',
    });
    const deps = createDeps();
    const actions = useVideoCollectionActions(deps);

    const response = await actions.runHistoricalBackfill('active-1', '테스트 채널');

    expect(response.success).toBe(false);
    expect(deps.setError).toHaveBeenCalledWith(expect.stringContaining('완료로 표시하지 않았습니다'));
    expect(deps.loadChannelsFromCloud).not.toHaveBeenCalled();
  });
});
