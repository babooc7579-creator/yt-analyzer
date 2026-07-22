import { describe, expect, it } from 'vitest';

import { getHomeNextAction, getHomeNextActionPanelViewProps } from './homeNextAction';

describe('homeNextAction utils', () => {
  it('builds the next action panel eyebrow copy', () => {
    expect(getHomeNextActionPanelViewProps()).toEqual({
      eyebrow: '다음 추천 행동',
    });
  });

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
    expect(action.impactText).toContain('화면 이동만');
    expect(action.impactText).toContain('등록 버튼');
    expect(action.onAction).toBe(onOpenAddChannel);
  });

  it('keeps channel selection clear that it does not call the YouTube API', () => {
    const onOpenChannelWatchlist = () => 'open channel watchlist';

    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 0,
      onOpenChannelWatchlist,
    });

    expect(action.tone).toBe('amber');
    expect(action.iconKey).toBe('listChecks');
    expect(action.description).toContain('YouTube API를 호출하지 않습니다');
    expect(action.actionLabel).toBe('오늘 볼 채널 열기');
    expect(action.actionTitle).toContain('Cloud DB 조회');
    expect(action.actionTitle).toContain('YouTube API 호출은 실행되지 않습니다');
    expect(action.impactText).toContain('화면 이동만');
    expect(action.impactText).toContain('볼 범위');
    expect(action.onAction).toBe(onOpenChannelWatchlist);
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
    expect(action.impactText).toContain('Cloud DB 조회');
    expect(action.impactText).toContain('YouTube API 호출은 실행하지 않습니다');
    expect(action.onAction).toBe(onLoadStoredVideos);
  });

  it('offers two explicit paths after a successful lookup returns zero videos', () => {
    const onOpenChannelWatchlist = () => 'open channel watchlist';
    const onOpenSelectedScan = () => 'open selected scan';

    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 3,
      loadedVideoCount: 0,
      storedVideoLoadResult: { success: true, videoCount: 0 },
      onOpenChannelWatchlist,
      onOpenSelectedScan,
    });

    expect(action.title).toBe('선택한 채널에는 저장된 영상이 없습니다');
    expect(action.actionLabel).toBe('다른 채널 고르기');
    expect(action.onAction).toBe(onOpenChannelWatchlist);
    expect(action.secondaryActions).toEqual([expect.objectContaining({
      label: '새 영상 수집 준비',
      onAction: onOpenSelectedScan,
    })]);
    expect(action.impactText).toContain('실제 수집 버튼을 누르기 전');
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
    expect(action.description).toContain('제작 후보로 표시하고');
    expect(action.description).not.toContain('제작 후보로 넘기고');
    expect(action.actionHref).toBe('#today-radar-candidates');
    expect(action.actionLabel).toBe('후보 판정 시작');
    expect(action.actionTitle).toContain('Cloud 저장이나 YouTube API 호출은 실행되지 않습니다');
    expect(action.impactText).toContain('후보 카드');
    expect(action.impactText).toContain('Cloud 판단 기록');
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
    expect(action.description).toContain('후보로 표시한 영상과 발견 링크');
    expect(action.description).not.toContain('후보로 남긴');
    expect(action.actionTitle).toContain('저장된 후보 조회');
    expect(action.actionTitle).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(action.impactText).toContain('화면 이동만');
    expect(action.impactText).toContain('후보 상태 변경');
    expect(action.onAction).toBe(onOpenProductionCandidates);
  });

  it('prioritizes discovery rights warnings before general production candidates', () => {
    const onOpenProductionCandidates = () => 'open production candidates';

    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 3,
      loadedVideoCount: 100,
      openRadarCandidateCount: 0,
      productionCandidateCount: 2,
      productionFocusCount: 1,
      discoveryCandidateCount: 3,
      discoveryRightsWarningCount: 2,
      onOpenProductionCandidates,
    });

    expect(action.tone).toBe('amber');
    expect(action.iconKey).toBe('shieldAlert');
    expect(action.badge).toBe('확인 필요');
    expect(action.metric).toBe('권리 확인 2개');
    expect(action.title).toContain('권리 확인');
    expect(action.actionTitle).toContain('저장된 후보 조회');
    expect(action.actionTitle).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(action.impactText).toContain('화면 이동만');
    expect(action.impactText).toContain('Cloud에 저장');
    expect(action.onAction).toBe(onOpenProductionCandidates);
  });

  it('opens today focus before the general candidate list when no rights warning remains', () => {
    const onOpenProductionCandidates = () => 'open production candidates';

    const action = getHomeNextAction({
      savedChannelCount: 12,
      selectedChannelCount: 3,
      loadedVideoCount: 100,
      openRadarCandidateCount: 0,
      productionCandidateCount: 4,
      productionFocusCount: 2,
      discoveryCandidateCount: 1,
      discoveryRightsWarningCount: 0,
      onOpenProductionCandidates,
    });

    expect(action.badge).toBe('오늘 집중');
    expect(action.metric).toBe('2개');
    expect(action.title).toContain('오늘 집중 후보');
    expect(action.actionLabel).toBe('오늘 집중 보기');
    expect(action.actionTitle).toContain('저장된 후보 조회');
    expect(action.actionTitle).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(action.impactText).toContain('화면 이동만');
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
    expect(action.impactText).toContain('실제 수집 버튼');
    expect(action.impactText).toContain('YouTube API');
    expect(action.onAction).toBe(onOpenSelectedScan);
  });
});
