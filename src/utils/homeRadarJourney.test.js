import { describe, expect, it } from 'vitest';

import {
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
    expect(loadStages[0].hint).toContain('분야·등급·수집일');
    expect(loadStages[1].status).toBe('current');
    expect(loadStages[1].hint).toContain('새 수집은 하지 않습니다');

    const reviewStages = getHomeRadarJourneyStages({
      loadedVideoCount: 30,
      openRadarCandidateCount: 6,
      selectedChannelCount: 2,
    });
    expect(reviewStages[1].status).toBe('complete');
    expect(reviewStages[2].status).toBe('current');
    expect(reviewStages[2].hint).toContain('상위 6개');
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
