import { describe, expect, it, vi } from 'vitest';

import {
  buildScriptBoardRouteProps,
  getScriptBoardCalendarIntent,
} from './scriptBoardRouteProps';

describe('buildScriptBoardRouteProps', () => {
  it('reuses existing Cloud production records and connects adjacent workspaces', () => {
    const openCreatorView = vi.fn();
    const updateVideoUserRecord = vi.fn();
    const setHasUnsavedProductionDrafts = vi.fn();
    const props = buildScriptBoardRouteProps({
      creatorViewIntent: { targetVideoId: 'video-1' },
      openCreatorView,
      savedVideos: [{ videoId: 'video-1' }],
      setHasUnsavedProductionDrafts,
      updateVideoUserRecord,
      videoUserRecords: { 'video-1': { draftTitle: '초안' } },
    });

    props.onOpenHome();
    props.onOpenImprovementLog();
    props.onOpenProductionCandidates({ videoId: 'video-1', title: '원본 제목', draftTitle: '내 제목' });
    props.onOpenUploadCalendar({
      record: { targetPublishDate: '2026-08-04' },
      video: { videoId: 'video-1' },
    });

    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'home' }],
      [{ id: 'insight-notes' }],
      [{
        id: 'studio-candidates',
        intent: {
          searchQuery: '내 제목',
          source: 'script-board',
          targetVideoId: 'video-1',
        },
      }],
      [{
        id: 'studio-calendar',
        intent: {
          source: 'script-board',
          targetPublishDate: '2026-08-04',
          targetVideoId: 'video-1',
        },
      }],
    ]);
    expect(props).toMatchObject({
      initialTargetVideoId: 'video-1',
      onUnsavedDraftsChange: setHasUnsavedProductionDrafts,
      onUpdateVideoRecord: updateVideoUserRecord,
      videoUserRecords: { 'video-1': { draftTitle: '초안' } },
      videos: [{ videoId: 'video-1' }],
    });
  });

  it('uses safe fallbacks when optional app state is missing', () => {
    const props = buildScriptBoardRouteProps();

    expect(props.initialTargetVideoId).toBe('');
    expect(props.videoUserRecords).toEqual({});
    expect(props.videos).toEqual([]);
    expect(() => props.onOpenHome()).not.toThrow();
  });

  it('builds calendar focus only from the selected script item', () => {
    expect(getScriptBoardCalendarIntent({
      record: { targetPublishDate: '2026-09-10' },
      video: { videoId: 'video-2' },
    })).toEqual({
      source: 'script-board',
      targetPublishDate: '2026-09-10',
      targetVideoId: 'video-2',
    });
    expect(getScriptBoardCalendarIntent()).toBeUndefined();
  });
});
