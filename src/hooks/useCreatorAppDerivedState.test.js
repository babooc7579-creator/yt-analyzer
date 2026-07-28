import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./useAppSyncWarnings', () => ({
  useAppSyncWarnings: vi.fn(() => ['온라인 저장소(Azure DB) 연결 실패로 임시 기록 표시 중']),
}));

vi.mock('./useCreatorOsMetrics', () => ({
  useCreatorOsMetrics: vi.fn(() => ({
    candidateCount: 3,
    savedVideoCount: 2,
  })),
}));

import { useAppSyncWarnings } from './useAppSyncWarnings';
import { useCreatorAppDerivedState } from './useCreatorAppDerivedState';
import { useCreatorOsMetrics } from './useCreatorOsMetrics';

describe('useCreatorAppDerivedState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('combines Creator OS metrics with Cloud sync warnings', () => {
    const props = {
      categories: ['해외'],
      discoveryLinks: [{ id: 'link-1' }],
      savedChannels: [{ id: 'channel-1' }],
      savedVideos: [{ videoId: 'video-1' }],
      scrapbookSyncWarning: '스크랩북 온라인 저장소(Azure DB) 연결 실패',
      selectedChannelIds: ['channel-1'],
      videoRecordsSyncWarning: '판단 기록 온라인 저장소(Azure DB) 연결 실패',
      videoUserRecords: { 'video-1': { statusIds: ['production_candidate'] } },
      videos: [{ videoId: 'video-1' }],
    };

    const derivedState = useCreatorAppDerivedState(props);

    expect(useCreatorOsMetrics).toHaveBeenCalledWith({
      categories: props.categories,
      discoveryLinks: props.discoveryLinks,
      savedChannels: props.savedChannels,
      savedVideos: props.savedVideos,
      selectedChannelIds: props.selectedChannelIds,
      videoUserRecords: props.videoUserRecords,
      videos: props.videos,
    });
    expect(useAppSyncWarnings).toHaveBeenCalledWith({
      scrapbookSyncWarning: props.scrapbookSyncWarning,
      videoRecordsSyncWarning: props.videoRecordsSyncWarning,
    });
    expect(derivedState).toEqual({
      candidateCount: 3,
      savedVideoCount: 2,
      syncWarnings: ['온라인 저장소(Azure DB) 연결 실패로 임시 기록 표시 중'],
    });
  });
});
