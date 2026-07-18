import { describe, expect, it, vi } from 'vitest';

import { buildTagVaultRouteProps } from './tagVaultRouteProps';

describe('buildTagVaultRouteProps', () => {
  it('connects tag channel selection and existing stored-video actions', () => {
    const openCreatorView = vi.fn();
    const setSelectedChannelIds = vi.fn();
    const props = buildTagVaultRouteProps({
      openCreatorView,
      loading: true,
      savedChannels: [{ id: 'c1' }],
      selectedChannelIds: ['c2'],
      setSelectedChannelIds,
      videos: [{ videoId: 'v1' }],
    });

    props.onSelectTagChannels(['c1']);
    props.onOpenChannels();
    props.onOpenChannelWatchlist();
    props.onOpenSelectedScan();

    expect(setSelectedChannelIds).toHaveBeenCalledWith(['c1']);
    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'ops-channels' }],
      [{ id: 'discovery-watchlist' }],
      [{ id: 'ops-channels', intent: { operationStage: 'scan' } }],
    ]);
    expect(props).toMatchObject({
      channels: [{ id: 'c1' }],
      loading: true,
      selectedChannelIds: ['c2'],
      selectedChannelKey: 'c2',
      videos: [{ videoId: 'v1' }],
    });
  });
});
