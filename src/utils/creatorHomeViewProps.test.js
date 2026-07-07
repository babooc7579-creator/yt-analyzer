import { describe, expect, it } from 'vitest';

import { getCreatorHomeViewProps } from './creatorHomeViewProps';

describe('creatorHomeViewProps utils', () => {
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
    props.radarSummaryProps.onOpenProductionCandidates();

    expect(openedViews).toEqual([
      'ops-add-channel',
      'vault-sources',
      'ops-selected-scan',
      'vault-all',
      'studio-scrapbook',
      'studio-candidates',
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
