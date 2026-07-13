import { describe, expect, it, vi } from 'vitest';

import { buildUploadCalendarRouteProps } from './uploadCalendarRouteProps';

describe('buildUploadCalendarRouteProps', () => {
  it('opens the existing production candidate view for schedule changes', () => {
    const openCreatorView = vi.fn();
    const props = buildUploadCalendarRouteProps({ openCreatorView, videoUserRecords: { v1: {} }, videos: [{ videoId: 'v1' }] });

    props.onOpenProductionCandidates();

    expect(openCreatorView).toHaveBeenCalledWith({ id: 'studio-candidates' });
    expect(props).toMatchObject({ videoUserRecords: { v1: {} }, videos: [{ videoId: 'v1' }] });
  });
});
