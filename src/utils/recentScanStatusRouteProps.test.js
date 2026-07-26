import { describe, expect, it, vi } from 'vitest';

import { buildRecentScanStatusRouteProps } from './recentScanStatusRouteProps';

describe('recentScanStatusRouteProps', () => {
  it('connects existing channel data and safe navigation actions', () => {
    const openCreatorView = vi.fn();
    const setSelectedChannelIds = vi.fn();
    const channels = [{ id: 'channel-1' }];
    const props = buildRecentScanStatusRouteProps({
      channelsLoading: true,
      openCreatorView,
      savedChannels: channels,
      setSelectedChannelIds,
    });

    expect(props.channels).toBe(channels);
    expect(props.channelsLoading).toBe(true);

    props.onOpenChannelOperations('channel-1');
    props.onOpenSelectedScan('channel-2');

    expect(setSelectedChannelIds.mock.calls).toEqual([
      [['channel-1']],
      [['channel-2']],
    ]);
    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'ops-channels', intent: { operationStage: 'manage' } }],
      [{ id: 'ops-channels', intent: { operationStage: 'scan' } }],
    ]);
  });

  it('keeps general navigation from replacing the current channel selection', () => {
    const openCreatorView = vi.fn();
    const setSelectedChannelIds = vi.fn();
    const props = buildRecentScanStatusRouteProps({
      openCreatorView,
      setSelectedChannelIds,
    });

    props.onOpenChannelOperations();
    props.onOpenSelectedScan();

    expect(setSelectedChannelIds).not.toHaveBeenCalled();
    expect(openCreatorView).toHaveBeenCalledTimes(2);
  });

  it('uses an empty channel list when app data is unavailable', () => {
    expect(buildRecentScanStatusRouteProps().channels).toEqual([]);
    expect(buildRecentScanStatusRouteProps().channelsLoading).toBe(false);
  });
});
