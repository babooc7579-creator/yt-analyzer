import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  fetchStoredVideosByChannelIdsMock,
  scanChannelsMock,
  scanSelectedChannelsMock,
} = vi.hoisted(() => ({
  fetchStoredVideosByChannelIdsMock: vi.fn(),
  scanChannelsMock: vi.fn(),
  scanSelectedChannelsMock: vi.fn(),
}));

vi.mock('../services/videoRecordsApi', () => ({
  fetchStoredVideosByChannelIds: fetchStoredVideosByChannelIdsMock,
}));

vi.mock('../services/scanApi', () => ({
  scanChannels: scanChannelsMock,
  scanSelectedChannels: scanSelectedChannelsMock,
}));

import { CHANNEL_STATUS } from '../constants/status';
import { scanChannels, scanSelectedChannels } from '../services/scanApi';
import { fetchStoredVideosByChannelIds } from '../services/videoRecordsApi';
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
    { id: 'active-1', status: CHANNEL_STATUS.ACTIVE },
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

    fetchStoredVideosByChannelIdsMock.mockResolvedValue({
      success: true,
      videos: [storedVideo],
    });
    scanChannelsMock.mockResolvedValue({
      success: true,
      results: [{ newVideosFound: 1, ttoTtoCandidates: [] }],
    });
    scanSelectedChannelsMock.mockResolvedValue({
      success: true,
      results: [{ newVideosFound: 2, ttoTtoCandidates: [{ id: 'candidate-1' }] }],
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('does not load stored videos when no channel is selected', async () => {
    const deps = createDeps({ selectedChannelIds: [] });
    const actions = useVideoCollectionActions(deps);

    await actions.loadStoredVideosForSelectedChannels();

    expect(deps.setError).toHaveBeenCalledWith(STORED_VIDEO_NO_CHANNEL_SELECTED_MESSAGE);
    expect(fetchStoredVideosByChannelIds).not.toHaveBeenCalled();
    expect(deps.setLoading).not.toHaveBeenCalled();
    expect(scanChannels).not.toHaveBeenCalled();
    expect(scanSelectedChannels).not.toHaveBeenCalled();
  });

  it('loads stored videos through the DB lookup service without starting a scan', async () => {
    const deps = createDeps({ selectedChannelIds: ['active-1', 'active-2'] });
    const actions = useVideoCollectionActions(deps);

    await actions.loadStoredVideosForSelectedChannels();

    expect(deps.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(deps.setError).toHaveBeenCalledWith('');
    expect(deps.setVideos).toHaveBeenNthCalledWith(1, []);
    expect(deps.clearCheckedVideos).toHaveBeenCalledTimes(1);
    expect(deps.setActiveTab).toHaveBeenCalledWith('dashboard');
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      'Cloud DB에 저장된 영상만 불러오는 중입니다. YouTube API를 새로 호출하지 않습니다.',
    );
    expect(fetchStoredVideosByChannelIds).toHaveBeenCalledWith(['active-1', 'active-2']);
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
      'Cloud DB 조회 완료: 저장된 영상 1개를 불러왔습니다. 새 YouTube API 호출은 없었습니다.',
    );
    expect(deps.setLoading).toHaveBeenLastCalledWith(false);

    vi.runOnlyPendingTimers();

    expect(deps.setProgressMsg).toHaveBeenLastCalledWith('');
  });

  it('keeps stored video load failures explicit about DB lookup failure', async () => {
    fetchStoredVideosByChannelIdsMock.mockResolvedValueOnce({
      success: false,
      error: 'Cloud unavailable',
    });
    const deps = createDeps();
    const actions = useVideoCollectionActions(deps);

    await actions.loadStoredVideosForSelectedChannels();

    expect(deps.setError).toHaveBeenCalledWith(
      'Cloud unavailable Cloud DB 조회를 완료하지 못했습니다. 새 YouTube API 호출이나 새 영상 수집은 실행하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
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

    await actions.handleManualScan();

    expect(scanSelectedChannels).toHaveBeenCalledWith(['active-1']);
    expect(scanChannels).not.toHaveBeenCalled();
    expect(deps.setIsScanning).toHaveBeenNthCalledWith(1, true);
    expect(deps.setScanningTag).toHaveBeenNthCalledWith(1, 'SELECTED');
    expect(deps.setProgressMsg).toHaveBeenCalledWith(
      '선택 채널 1개 새 영상 수집 중입니다. YouTube API 호출이 발생하며 저장 영상 불러오기와 다른 작업입니다.',
    );
    expect(deps.loadChannelsFromCloud).toHaveBeenCalledTimes(1);
    expect(fetchStoredVideosByChannelIds).toHaveBeenCalledWith(['active-1', 'paused-1']);
    expect(deps.setIsScanning).toHaveBeenLastCalledWith(false);
    expect(deps.setScanningTag).toHaveBeenLastCalledWith(null);
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
    expect(fetchStoredVideosByChannelIds).not.toHaveBeenCalled();
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
      "'history' 태그 채널 새 영상 수집 중입니다. YouTube API 호출이 발생하며 저장 영상 불러오기와 다른 작업입니다.",
    );
    expect(deps.loadChannelsFromCloud).toHaveBeenCalledTimes(1);
    expect(fetchStoredVideosByChannelIds).toHaveBeenCalledWith(['active-1']);
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
    expect(fetchStoredVideosByChannelIds).not.toHaveBeenCalled();
    expect(deps.setIsScanning).toHaveBeenLastCalledWith(false);
    expect(deps.setScanningTag).toHaveBeenLastCalledWith(null);
  });
});
