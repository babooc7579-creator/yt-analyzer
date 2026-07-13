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
      '터또터 기준',
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
    expect(statsProps.cards[2].description).toContain('Cloud 스크랩북에 보관한 영상');
    expect(statsProps.cards[0].description).toContain('YouTube API를 호출하지 않습니다');
    expect(statsProps.cards[1].description).toContain('새 YouTube API 호출 수가 아닙니다');
    expect(statsProps.cards[3].description).toContain('현재 새 수집이 실행 중이라는 뜻은 아닙니다');
    expect(statsProps.cards[4].description).toContain('판단 보조 신호');
    expect(statsProps.cards[5].description).toContain('Cloud 판단 기록');
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
      discoveryCandidateCount: 4,
      discoveryRightsWarningCount: 2,
      latestScanText: 'just now',
      openRadarCandidateCount: 5,
      productionCandidateCount: 3,
      productionFocusCount: 2,
      savedChannels: [{ id: 'channel1' }, { id: 'channel2' }],
      savedVideos: [{ videoId: 'saved1' }],
      selectedChannelCount: 2,
      ttoTtoAssetCount: 7,
      videos: [{ videoId: 'video1' }, { videoId: 'video2' }],
      onOpenView: () => {},
    });

    expect(props.radarSummaryProps).toMatchObject({
      discoveryCandidateCount: 4,
      discoveryRightsWarningCount: 2,
      latestScanText: 'just now',
      loadedVideoCount: 2,
      openRadarCandidateCount: 5,
      productionCandidateCount: 3,
      productionFocusCount: 2,
      savedChannelCount: 2,
      savedVideoCount: 1,
      selectedChannelCount: 2,
      ttoTtoAssetCount: 7,
    });
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
      toggleScrapVideo,
      videoUserRecords,
      videos,
      onOpenView: () => {},
    });

    expect(props.radarCandidateStripProps).toMatchObject({
      savedVideos,
      selectedChannelCount: 1,
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
    const onOpenView = (item) => openedViews.push(item.id);

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
      'ops-add-channel',
      'vault-sources',
      'ops-selected-scan',
      'vault-all',
      'studio-candidates',
      'studio-scrapbook',
      'discovery-watchlist',
      'vault-all',
      'ops-add-channel',
      'discovery-watchlist',
      'vault-sources',
      'studio-candidates',
      'ops-selected-scan',
      'discovery-ttotto',
      'vault-all',
      'discovery-keywords',
      'vault-tags',
      'studio-calendar',
    ]);
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
