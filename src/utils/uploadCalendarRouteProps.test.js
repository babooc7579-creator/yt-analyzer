import { describe, expect, it, vi } from 'vitest';

import {
  buildUploadCalendarRouteProps,
  getUploadCalendarProductionSearchQuery,
} from './uploadCalendarRouteProps';

describe('buildUploadCalendarRouteProps', () => {
  it('opens the existing production candidate view for schedule changes', () => {
    const openCreatorView = vi.fn();
    const props = buildUploadCalendarRouteProps({ openCreatorView, videoUserRecords: { v1: {} }, videos: [{ videoId: 'v1' }] });

    props.onOpenProductionCandidates();
    props.onOpenProductionCandidate({ title: '예약 영상', videoId: 'v1' });

    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'studio-candidates' }],
      [{
        id: 'studio-candidates',
        intent: { searchQuery: '예약 영상', source: 'upload-calendar' },
      }],
    ]);
    expect(props).toMatchObject({ videoUserRecords: { v1: {} }, videos: [{ videoId: 'v1' }] });
  });

  it('uses the best available item label for the production search', () => {
    expect(getUploadCalendarProductionSearchQuery({ draftTitle: '초안 제목', title: '원본 제목' })).toBe('초안 제목');
    expect(getUploadCalendarProductionSearchQuery({ videoId: 'video-only' })).toBe('video-only');
  });
});
