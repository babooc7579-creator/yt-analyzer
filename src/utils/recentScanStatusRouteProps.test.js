import { describe, expect, it, vi } from 'vitest';

import { buildRecentScanStatusRouteProps } from './recentScanStatusRouteProps';

describe('recentScanStatusRouteProps', () => {
  it('connects existing channel data and safe navigation actions', () => {
    const openCreatorView = vi.fn();
    const channels = [{ id: 'channel-1' }];
    const props = buildRecentScanStatusRouteProps({
      openCreatorView,
      savedChannels: channels,
    });

    expect(props.channels).toBe(channels);

    props.onOpenChannelOperations();
    props.onOpenSelectedScan();

    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'ops-channels', intent: { operationStage: 'manage' } }],
      [{ id: 'ops-channels', intent: { operationStage: 'scan' } }],
    ]);
  });

  it('uses an empty channel list when app data is unavailable', () => {
    expect(buildRecentScanStatusRouteProps().channels).toEqual([]);
  });
});
