import { describe, expect, it } from 'vitest';

import {
  getHomeRadarJourneyProgress,
  getHomeRadarJourneyStages,
  getLoadedVideoCountForSelectedChannels,
  hasEmptyStoredVideoLoad,
} from './homeRadarJourney';

describe('homeRadarJourney', () => {
  it('distinguishes an untouched empty screen from a successful zero-video lookup', () => {
    expect(hasEmptyStoredVideoLoad(null)).toBe(false);
    expect(hasEmptyStoredVideoLoad({ success: true, videoCount: 0 })).toBe(true);
  });

  it('moves the current stage from channel choice to load and candidate review', () => {
    expect(getHomeRadarJourneyStages()[0].status).toBe('current');

    const loadStages = getHomeRadarJourneyStages({ selectedChannelCount: 2 });
    expect(loadStages[0].status).toBe('complete');
    expect(loadStages[0].href).toBe('#today-radar-channels');
    expect(loadStages[0].hint).toContain('분야·등급·수집일');
    expect(loadStages[1].status).toBe('current');
    expect(loadStages[1].href).toBe('#today-radar-load');
    expect(loadStages[1].hint).toContain('새 수집은 하지 않습니다');

    const reviewStages = getHomeRadarJourneyStages({
      loadedVideoCount: 30,
      openRadarCandidateCount: 6,
      selectedChannelCount: 2,
    });
    expect(reviewStages[1].status).toBe('complete');
    expect(reviewStages[2].status).toBe('current');
    expect(reviewStages[2].href).toBe('#today-radar-candidates');
    expect(reviewStages[2].hint).toContain('상위 6개');
    expect(reviewStages[3].href).toBe('#today-radar-finish');
  });

  it('shows the channel step as a Cloud lookup before the empty result is known', () => {
    const stages = getHomeRadarJourneyStages({
      channelsLoading: true,
      selectedChannelCount: 0,
    });

    expect(stages[0]).toMatchObject({
      status: 'current',
      value: 'Cloud 조회 중',
    });
    expect(stages[1].status).toBe('upcoming');
  });

  it('marks a successful zero-video lookup as an actionable warning', () => {
    const stages = getHomeRadarJourneyStages({
      selectedChannelCount: 2,
      storedVideoLoadResult: { success: true, videoCount: 0 },
    });

    expect(stages[1]).toMatchObject({
      status: 'current',
      value: '저장 영상 0개',
      warning: true,
    });
  });

  it('opens the production stage as soon as a candidate exists and completes it after focus selection', () => {
    const candidateStages = getHomeRadarJourneyStages({
      loadedVideoCount: 30,
      openRadarCandidateCount: 5,
      productionCandidateCount: 1,
      selectedChannelCount: 2,
    });
    expect(candidateStages[2].status).toBe('current');
    expect(candidateStages[3]).toMatchObject({
      status: 'ready',
      value: '1개 후보',
    });

    const focusedProgress = getHomeRadarJourneyProgress({
      loadedVideoCount: 30,
      openRadarCandidateCount: 5,
      productionCandidateCount: 2,
      productionFocusCount: 1,
      selectedChannelCount: 2,
    });
    expect(focusedProgress).toMatchObject({
      activeStageTitle: '오늘 후보 판단',
      completedCount: 2,
      stageCount: 4,
    });
    expect(focusedProgress.stages[3]).toMatchObject({
      status: 'complete',
      value: '1개 오늘 집중',
    });

    expect(getHomeRadarJourneyProgress({
      loadedVideoCount: 30,
      openRadarCandidateCount: 0,
      productionCandidateCount: 2,
      productionFocusCount: 1,
      selectedChannelCount: 2,
    })).toMatchObject({
      activeStageTitle: '오늘 흐름 완료',
      completedCount: 4,
      stageCount: 4,
    });
  });

  it('counts only loaded videos that belong to the currently selected channels', () => {
    expect(getLoadedVideoCountForSelectedChannels({
      savedChannels: [
        { id: 'c1', title: '채널 하나' },
        { id: 'c2', title: '채널 둘' },
      ],
      selectedChannelIds: ['c2'],
      videos: [
        { videoId: 'v1', channel_id: 'c1' },
        { videoId: 'v2', channelId: 'c2' },
        { videoId: 'v3', channel_title: '채널 둘' },
      ],
    })).toBe(2);
    expect(getLoadedVideoCountForSelectedChannels({ selectedChannelIds: [], videos: [{ channel_id: 'c1' }] })).toBe(0);
  });
});
