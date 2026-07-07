import { describe, expect, it } from 'vitest';

import { getHomeNextAction } from './homeNextAction';

describe('homeNextAction utils', () => {
  it('starts with channel registration when no channels are saved', () => {
    const onOpenAddChannel = () => 'add channel';

    const action = getHomeNextAction({
      savedChannelCount: 0,
      onOpenAddChannel,
    });

    expect(action.tone).toBe('indigo');
    expect(action.iconKey).toBe('plus');
    expect(action.title).toContain('소재 채널');
    expect(action.metric).toBe('채널 0개');
    expect(action.onAction).toBe(onOpenAddChannel);
  });

  it('keeps channel selection clear that it does not call the YouTube API', () => {
    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 0,
    });

    expect(action.tone).toBe('amber');
    expect(action.iconKey).toBe('listChecks');
    expect(action.description).toContain('YouTube API를 호출하지 않습니다');
    expect(action.actionLabel).toBeUndefined();
  });

  it('keeps stored video loading clear that it is a Cloud DB lookup without YouTube API calls', () => {
    const onLoadStoredVideos = () => 'load stored videos';

    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 3,
      loadedVideoCount: 0,
      onLoadStoredVideos,
    });

    expect(action.tone).toBe('blue');
    expect(action.iconKey).toBe('bookmark');
    expect(action.badge).toBe('DB 조회');
    expect(action.description).toContain('Cloud DB');
    expect(action.description).toContain('새 YouTube API 호출은 없습니다');
    expect(action.actionTitle).toContain('DB 조회');
    expect(action.actionTitle).toContain('새 YouTube API 호출은 없습니다');
    expect(action.onAction).toBe(onLoadStoredVideos);
  });

  it('prioritizes open radar candidates before stored production candidates', () => {
    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 3,
      loadedVideoCount: 100,
      openRadarCandidateCount: 4,
      productionCandidateCount: 9,
      discoveryCandidateCount: 2,
    });

    expect(action.tone).toBe('rose');
    expect(action.iconKey).toBe('checkCircle');
    expect(action.metric).toBe('4개 남음');
    expect(action.title).toContain('오늘 후보');
  });

  it('opens production candidates as a stored candidate lookup after radar candidates are done', () => {
    const onOpenProductionCandidates = () => 'open production candidates';

    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 3,
      loadedVideoCount: 100,
      openRadarCandidateCount: 0,
      productionCandidateCount: 2,
      discoveryCandidateCount: 3,
      onOpenProductionCandidates,
    });

    expect(action.tone).toBe('emerald');
    expect(action.iconKey).toBe('rocket');
    expect(action.metric).toBe('후보 5개');
    expect(action.actionTitle).toContain('저장된 후보 조회');
    expect(action.actionTitle).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(action.onAction).toBe(onOpenProductionCandidates);
  });

  it('sends the user to manual collection only when nothing else is waiting', () => {
    const onOpenSelectedScan = () => 'open selected scan';

    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 3,
      loadedVideoCount: 100,
      openRadarCandidateCount: 0,
      productionCandidateCount: 0,
      discoveryCandidateCount: 0,
      onOpenSelectedScan,
    });

    expect(action.tone).toBe('emerald');
    expect(action.iconKey).toBe('refresh');
    expect(action.badge).toBe('YouTube API 가능');
    expect(action.description).toContain('YouTube API를 사용할 수 있습니다');
    expect(action.actionTitle).toContain('이동만으로 수집이 실행되지는 않습니다');
    expect(action.onAction).toBe(onOpenSelectedScan);
  });
});
