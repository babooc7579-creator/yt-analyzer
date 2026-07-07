import { describe, expect, it } from 'vitest';

import { buildLegacyWorkspaceRouteProps } from './legacyWorkspaceRouteProps';

describe('legacyWorkspaceRouteProps utils', () => {
  it('preserves existing workspace props and adds the total video count', () => {
    const videos = [{ videoId: 'video1' }, { videoId: 'video2' }];

    const props = buildLegacyWorkspaceRouteProps({
      activeTag: 'history',
      videos,
    });

    expect(props.activeTag).toBe('history');
    expect(props.videos).toBe(videos);
    expect(props.totalVideoCount).toBe(2);
  });

  it('maps the discovery link change handler to updateDiscoveryLink', () => {
    const changeDiscoveryLink = () => 'changed';

    const props = buildLegacyWorkspaceRouteProps({
      changeDiscoveryLink,
    });

    expect(props.changeDiscoveryLink).toBe(changeDiscoveryLink);
    expect(props.updateDiscoveryLink).toBe(changeDiscoveryLink);
  });

  it('uses a safe zero total for invalid video input', () => {
    const props = buildLegacyWorkspaceRouteProps({
      videos: 'bad',
    });

    expect(props.totalVideoCount).toBe(0);
  });
});
