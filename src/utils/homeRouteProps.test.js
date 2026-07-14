import { describe, expect, it } from 'vitest';

import { buildHomeRouteProps } from './homeRouteProps';

describe('homeRouteProps utils', () => {
  it('builds home route props from dashboard counts and records', () => {
    const savedChannels = [{ id: 'channel1' }];
    const savedVideos = [{ videoId: 'saved1' }];
    const videoUserRecords = { video1: { status: 'candidate' } };
    const videos = [{ videoId: 'video1' }, { videoId: 'video2' }];

    const props = buildHomeRouteProps({
      discoveryCandidateCount: 4,
      discoveryRightsWarningCount: 2,
      latestScanText: 'just now',
      openRadarCandidateCount: 5,
      productionCandidateCount: 3,
      productionFocusCount: 2,
      savedChannels,
      savedVideos,
      selectedChannelIds: ['channel1', 'channel2'],
      ttoTtoAssetCount: 7,
      videoUserRecords,
      videos,
    });

    expect(props).toMatchObject({
      discoveryCandidateCount: 4,
      discoveryRightsWarningCount: 2,
      latestScanText: 'just now',
      openRadarCandidateCount: 5,
      productionCandidateCount: 3,
      productionFocusCount: 2,
      savedChannels,
      savedVideos,
      selectedChannelIds: ['channel1', 'channel2'],
      selectedChannelCount: 2,
      selectedChannelKey: 'channel1|channel2',
      ttoTtoAssetCount: 7,
      videoUserRecords,
      videos,
    });
  });

  it('forwards home route handlers without invoking them', () => {
    const clearRadarDecisions = () => 'clear';
    const isVideoSaved = () => true;
    const loadStoredVideosForSelectedChannels = () => 'load';
    const markRadarVideoStatus = () => 'mark';
    const openCreatorView = () => 'open';
    const promoteVideoToProduction = () => 'promote';
    const restoreVideoToRadar = () => 'restore';
    const toggleScrapVideo = () => 'toggle';
    const toggleChannelSelection = () => 'toggle-channel';

    const props = buildHomeRouteProps({
      clearRadarDecisions,
      isVideoSaved,
      loadStoredVideosForSelectedChannels,
      markRadarVideoStatus,
      openCreatorView,
      promoteVideoToProduction,
      restoreVideoToRadar,
      toggleChannelSelection,
      toggleScrapVideo,
    });

    expect(props.clearRadarDecisions).toBe(clearRadarDecisions);
    expect(props.isVideoSaved).toBe(isVideoSaved);
    expect(props.loadStoredVideosForSelectedChannels).toBe(loadStoredVideosForSelectedChannels);
    expect(props.markRadarVideoStatus).toBe(markRadarVideoStatus);
    expect(props.onOpenView).toBe(openCreatorView);
    expect(props.promoteVideoToProduction).toBe(promoteVideoToProduction);
    expect(props.restoreVideoToRadar).toBe(restoreVideoToRadar);
    expect(props.toggleChannelSelection).toBe(toggleChannelSelection);
    expect(props.toggleScrapVideo).toBe(toggleScrapVideo);
  });

  it('uses a safe zero selected channel count for invalid selected channel input', () => {
    const props = buildHomeRouteProps({
      selectedChannelIds: 'channel1',
    });

    expect(props.selectedChannelCount).toBe(0);
    expect(props.selectedChannelKey).toBe('');
  });

  it('builds a stable selection key even when channel order changes', () => {
    const props = buildHomeRouteProps({
      selectedChannelIds: ['channel-b', 'channel-a'],
    });

    expect(props.selectedChannelKey).toBe('channel-a|channel-b');
  });
});
