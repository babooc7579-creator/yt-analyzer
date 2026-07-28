import { describe, expect, it } from 'vitest';

import {
  getCreatorHomeViewProps,
  getHomeOperatingGuidelinesViewProps,
  getHomeRadarHeroViewProps,
  getHomeRadarStatsGridViewProps,
} from './creatorHomeViewProps';

describe('creatorHomeViewProps utils', () => {
  it('builds home hero, operating guideline, and summary card copy', () => {
    const heroProps = getHomeRadarHeroViewProps();
    const guidelinesProps = getHomeOperatingGuidelinesViewProps();
    const statsProps = getHomeRadarStatsGridViewProps({
      discoveryCandidateCount: 6,
      discoveryRightsWarningCount: 1,
      latestScanText: 'just now',
      loadedVideoCount: 10,
      productionCandidateCount: 5,
      productionFocusCount: 2,
      savedChannelCount: 2,
      savedVideoCount: 3,
      ttoTtoAssetCount: 4,
    });

    expect(heroProps).toMatchObject({
      eyebrow: '오늘의 레이더',
      title: '오늘 볼 소재와 다음 행동을 먼저 정합니다',
    });
    expect(heroProps.description).toContain('발굴');
    expect(guidelinesProps.sectionTitle).toBe('운영 기준');
    expect(guidelinesProps.guidelines.map(guideline => guideline.title)).toEqual([
      '수집은 API 호출',
      '불러오기는 저장 데이터 조회',
      '또터또 기준',
    ]);
    expect(guidelinesProps.guidelines[0].description).toContain('YouTube API');
    expect(statsProps.cards.map(card => [card.label, card.value])).toEqual([
      ['저장된 채널', 2],
      ['현재 화면 영상', 10],
      ['스크랩북 보관', 3],
      ['마지막 수집 기록', 'just now'],
      ['또터또 후보', 4],
      ['제작 후보', 5],
      ['오늘 집중', 2],
      ['발견 링크 후보', 6],
    ]);
    expect(statsProps.cards[2].description).toContain('온라인 스크랩북(Azure DB)에 보관한 영상');
    expect(statsProps.cards[0].description).toContain('YouTube API를 호출하지 않습니다');
    expect(statsProps.cards[1].description).toContain('새 YouTube API 호출 수가 아닙니다');
    expect(statsProps.cards[3].description).toContain('현재 새 수집이 실행 중이라는 뜻은 아닙니다');
    expect(statsProps.cards[4].description).toContain('판단 보조 신호');
    expect(statsProps.cards[5].description).toContain('온라인 저장소(Azure DB)의 판단 기록');
    expect(statsProps.cards[5].description).toContain('오늘 집중 영상도 이 숫자에 포함');
    expect(statsProps.cards[5].description).toContain('저장이나 API 호출은 실행하지 않습니다');
    expect(statsProps.cards[6].description).toContain('오늘 집중으로 고정한 영상');
    expect(statsProps.cards[6].description).toContain('YouTube API 호출은 실행하지 않습니다');
    expect(statsProps.cards[7].description).toContain('권리 확인 필요 1개');
    expect(statsProps.cards[2].description).not.toContain('제작 후보로 표시한 영상');
    expect(statsProps.cards[2].description).not.toContain('제작 후보로 남긴');
    expect(statsProps.cards[3].className).toContain('emerald');
    expect(statsProps.cards[4].className).toContain('rose');
    expect(statsProps.cards[5].className).toContain('indigo');
    expect(statsProps.cards[6].className).toContain('cyan');
    expect(statsProps.cards[7].className).toContain('amber');
  });

  it('builds home summary counts and dashboard metrics from provided lists', () => {
    const props = getCreatorHomeViewProps({
      channelsLoading: true,
      discoveryCandidateCount: 4,
      discoveryRightsWarningCount: 2,
      latestScanText: 'just now',
      openRadarCandidateCount: 5,
      productionCandidateCount: 3,
      productionFocusCount: 2,
      savedChannels: [{ id: 'channel1' }, { id: 'channel2' }],
      savedVideos: [{ videoId: 'saved1' }],
      selectedChannelCount: 2,
      selectedChannelIds: ['channel1'],
      ttoTtoAssetCount: 7,
      videos: [{ videoId: 'video1', channel_id: 'channel1' }, { videoId: 'video2', channel_id: 'channel2' }],
      onOpenView: () => {},
    });

    expect(props.radarSummaryProps).toMatchObject({
      channelsLoading: true,
      discoveryCandidateCount: 4,
      discoveryRightsWarningCount: 2,
      latestScanText: 'just now',
      loadedVideoCount: 2,
      openRadarCandidateCount: 5,
      productionCandidateCount: 3,
      productionFocusCount: 2,
      savedChannelCount: 2,
      savedVideoCount: 1,
      selectedChannelIds: ['channel1'],
      selectedChannelCount: 2,
      selectedLoadedVideoCount: 1,
      ttoTtoAssetCount: 7,
    });
    expect(props.nextActionProps.channelsLoading).toBe(true);
  });

  it('uses a loading label for the saved channel metric before Cloud responds', () => {
    const statsProps = getHomeRadarStatsGridViewProps({
      channelsLoading: true,
      savedChannelCount: 0,
    });

    expect(statsProps.cards[0]).toMatchObject({
      label: '저장된 채널',
      value: '조회 중',
    });
    expect(statsProps.cards[0].description).toContain('온라인 저장소(Azure DB)');
  });

  it('builds radar candidate strip props with videos, records, and handlers', () => {
    const clearRadarDecisions = () => 'clear';
    const isVideoSaved = () => true;
    const loadStoredVideosForSelectedChannels = () => 'load';
    const markRadarVideoStatus = () => 'mark';
    const promoteVideoToProduction = () => 'promote';
    const restoreVideoToRadar = () => 'restore';
    const toggleScrapVideo = () => 'toggle';
    const savedVideos = [{ videoId: 'saved1' }];
    const videoUserRecords = { video1: { status: 'candidate' } };
    const videos = [{ videoId: 'video1' }];

    const props = getCreatorHomeViewProps({
      clearRadarDecisions,
      isVideoSaved,
      loadStoredVideosForSelectedChannels,
      markRadarVideoStatus,
      promoteVideoToProduction,
      restoreVideoToRadar,
      savedVideos,
      selectedChannelCount: 1,
      storedVideoLoadPending: true,
      toggleScrapVideo,
      videoUserRecords,
      videos,
      onOpenView: () => {},
    });

    expect(props.radarCandidateStripProps).toMatchObject({
      savedVideos,
      selectedChannelCount: 1,
      storedVideoLoadPending: true,
      videoUserRecords,
      videos,
    });
    expect(props.radarCandidateStripProps.isVideoSaved).toBe(isVideoSaved);
    expect(props.radarCandidateStripProps.onClearDecisions).toBe(clearRadarDecisions);
    expect(props.radarCandidateStripProps.onLoadStoredVideos).toBe(loadStoredVideosForSelectedChannels);
    expect(props.radarCandidateStripProps.onMarkVideoStatus).toBe(markRadarVideoStatus);
    expect(props.radarCandidateStripProps.onPromoteToProduction).toBe(promoteVideoToProduction);
    expect(props.radarCandidateStripProps.onRestoreVideo).toBe(restoreVideoToRadar);
    expect(props.radarCandidateStripProps.onToggleScrap).toBe(toggleScrapVideo);
  });

  it('opens the expected Creator OS views from home shortcuts and summary actions', () => {
    const openedViews = [];
    const onOpenView = (item) => openedViews.push(item);

    const props = getCreatorHomeViewProps({ onOpenView });

    props.actionShortcutsProps.onOpenAddChannel();
    props.actionShortcutsProps.onOpenDiscoveryLinks();
    props.actionShortcutsProps.onOpenSelectedScan();
    props.actionShortcutsProps.onOpenVault();
    props.radarCandidateStripProps.onOpenProductionCandidates();
    props.radarCandidateStripProps.onOpenScrapbook();
    props.radarCandidateStripProps.onOpenChannelWatchlist();
    props.radarCandidateStripProps.onOpenVault();
    props.radarSummaryProps.onOpenAddChannel();
    props.radarSummaryProps.onOpenChannelWatchlist();
    props.radarSummaryProps.onOpenDiscoveryLinks();
    props.radarSummaryProps.onOpenProductionCandidates();
    props.radarSummaryProps.onOpenSelectedScan();
    props.radarSummaryProps.onOpenTtoTto();
    props.radarSummaryProps.onOpenVault();
    props.workspaceShortcutsProps.onOpenKeywordExplorer();
    props.workspaceShortcutsProps.onOpenTagVault();
    props.workspaceShortcutsProps.onOpenUploadCalendar();

    expect(openedViews).toEqual([
      { id: 'ops-channels', intent: { operationStage: 'add' } },
      { id: 'vault-sources' },
      { id: 'ops-channels', intent: { operationStage: 'scan' } },
      { id: 'vault-videos' },
      { id: 'studio-candidates' },
      { id: 'studio-scrapbook' },
      { id: 'discovery-watchlist' },
      { id: 'vault-videos' },
      { id: 'ops-channels', intent: { operationStage: 'add' } },
      { id: 'discovery-watchlist' },
      { id: 'vault-sources' },
      { id: 'studio-candidates' },
      { id: 'ops-channels', intent: { operationStage: 'scan' } },
      { id: 'discovery-ttotto' },
      { id: 'vault-videos' },
      { id: 'discovery-keywords' },
      { id: 'vault-tags' },
      { id: 'studio-calendar' },
    ]);
  });

  it('opens a newly promoted radar candidate as a focused production search', () => {
    const openedViews = [];
    const props = getCreatorHomeViewProps({
      onOpenView: (item) => openedViews.push(item),
    });
    const intent = {
      searchQuery: '오늘 만들 영상',
      source: 'today-radar',
      targetVideoId: 'video-1',
    };

    props.radarCandidateStripProps.onOpenProductionCandidates(intent);

    expect(openedViews).toEqual([{ id: 'studio-candidates', intent }]);
  });

  it('uses safe empty lists and zero counts for invalid list inputs', () => {
    const props = getCreatorHomeViewProps({
      savedChannels: null,
      savedVideos: 'bad',
      videos: {},
      onOpenView: () => {},
    });

    expect(props.radarCandidateStripProps.savedVideos).toEqual([]);
    expect(props.radarCandidateStripProps.videos).toEqual([]);
    expect(props.radarSummaryProps.savedChannelCount).toBe(0);
    expect(props.radarSummaryProps.savedVideoCount).toBe(0);
    expect(props.radarSummaryProps.loadedVideoCount).toBe(0);
  });
});
