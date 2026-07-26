import { describe, expect, it, vi } from 'vitest';

import { buildKeywordExplorerRouteProps } from './keywordExplorerRouteProps';

describe('keywordExplorerRouteProps', () => {
  it('connects stored-video actions without invoking them while building props', () => {
    const openCreatorView = vi.fn();
    const props = buildKeywordExplorerRouteProps({
      checkedVideos: ['v1'],
      loading: true,
      openCreatorView,
      selectedChannelIds: ['c1', 'c2'],
      videos: [{ videoId: 'v1' }],
    });

    expect(props).toMatchObject({
      checkedVideos: ['v1'],
      loading: true,
      selectedChannelCount: 2,
      selectedChannelKey: 'c1|c2',
      videos: [{ videoId: 'v1' }],
    });
    expect(openCreatorView).not.toHaveBeenCalled();

    props.onOpenChannelWatchlist();
    props.onOpenSelectedScan();
    props.onOpenVault();
    props.onOpenWorkTools();
    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'discovery-watchlist' }],
      [{ id: 'ops-channels', intent: { operationStage: 'scan' } }],
      [{ id: 'vault-videos' }],
      [{ id: 'tools-bookmarks' }],
    ]);
  });
});
