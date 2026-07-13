import { describe, expect, it, vi } from 'vitest';

import { buildTagVaultRouteProps } from './tagVaultRouteProps';

describe('buildTagVaultRouteProps', () => {
  it('connects tag channel selection and existing stored-video actions', () => {
    const openCreatorView = vi.fn();
    const setSelectedChannelIds = vi.fn();
    const props = buildTagVaultRouteProps({
      openCreatorView,
      savedChannels: [{ id: 'c1' }],
      selectedChannelIds: ['c2'],
      setSelectedChannelIds,
      videos: [{ videoId: 'v1' }],
    });

    props.onSelectTagChannels(['c1']);
    props.onOpenChannels();

    expect(setSelectedChannelIds).toHaveBeenCalledWith(['c1']);
    expect(openCreatorView).toHaveBeenCalledWith({ id: 'ops-channels' });
    expect(props).toMatchObject({ channels: [{ id: 'c1' }], selectedChannelIds: ['c2'], videos: [{ videoId: 'v1' }] });
  });
});
