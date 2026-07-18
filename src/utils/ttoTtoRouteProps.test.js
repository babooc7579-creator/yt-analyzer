import { describe, expect, it, vi } from 'vitest';

import { buildTtoTtoRouteProps } from './ttoTtoRouteProps';

describe('ttoTtoRouteProps utils', () => {
  it('connects stored videos and Cloud actions without invoking them', () => {
    const openCreatorView = vi.fn();
    const loadStoredVideosForSelectedChannels = vi.fn();
    const props = buildTtoTtoRouteProps({
      loadStoredVideosForSelectedChannels,
      loading: true,
      openCreatorView,
      savedVideos: [{ videoId: 'saved-1' }],
      selectedChannelIds: ['channel-1', 'channel-2'],
      videos: [{ videoId: 'video-1' }],
    });

    expect(props).toMatchObject({
      onLoadStoredVideos: loadStoredVideosForSelectedChannels,
      loading: true,
      selectedChannelCount: 2,
      savedVideos: [{ videoId: 'saved-1' }],
      videos: [{ videoId: 'video-1' }],
    });
    expect(openCreatorView).not.toHaveBeenCalled();

    props.onOpenProductionCandidates();
    props.onOpenScrapbook();
    props.onOpenVault();

    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'studio-candidates' }],
      [{ id: 'studio-scrapbook' }],
      [{ id: 'vault-videos' }],
    ]);
  });
});
