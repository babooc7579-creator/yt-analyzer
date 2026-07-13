import { describe, expect, it, vi } from 'vitest';

import { buildKeywordExplorerRouteProps } from './keywordExplorerRouteProps';

describe('keywordExplorerRouteProps', () => {
  it('connects stored-video actions without invoking them while building props', () => {
    const openCreatorView = vi.fn();
    const props = buildKeywordExplorerRouteProps({
      checkedVideos: ['v1'],
      openCreatorView,
      selectedChannelIds: ['c1', 'c2'],
      videos: [{ videoId: 'v1' }],
    });

    expect(props).toMatchObject({
      checkedVideos: ['v1'],
      selectedChannelCount: 2,
      videos: [{ videoId: 'v1' }],
    });
    expect(openCreatorView).not.toHaveBeenCalled();

    props.onOpenChannelWatchlist();
    props.onOpenVault();
    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'discovery-watchlist' }],
      [{ id: 'vault-videos' }],
    ]);
  });
});
