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
      latestScanText: 'just now',
      loadedVideoCount: 10,
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
      ['불러온 영상', 10],
      ['스크랩 소재', 3],
      ['최근 수집 상태', 'just now'],
      ['터또터 후보', 4],
    ]);
    expect(statsProps.cards[3].className).toContain('emerald');
    expect(statsProps.cards[4].className).toContain('rose');
  });

  it('builds home summary counts and dashboard metrics from provided lists', () => {
    const props = getCreatorHomeViewProps({
      discoveryCandidateCount: 4,
      discoveryRightsWarningCount: 2,
      latestScanText: 'just now',
      openRadarCandidateCount: 5,
      productionCandidateCount: 3,
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
    props.radarCandidateStripProps.onOpenScrapbook();
    props.radarCandidateStripProps.onOpenVault();
    props.radarSummaryProps.onOpenAddChannel();
    props.radarSummaryProps.onOpenDiscoveryLinks();
    props.radarSummaryProps.onOpenProductionCandidates();
    props.radarSummaryProps.onOpenSelectedScan();

    expect(openedViews).toEqual([
      'ops-add-channel',
      'vault-sources',
      'ops-selected-scan',
      'vault-all',
      'studio-scrapbook',
      'vault-all',
      'ops-add-channel',
      'vault-sources',
      'studio-candidates',
      'ops-selected-scan',
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
