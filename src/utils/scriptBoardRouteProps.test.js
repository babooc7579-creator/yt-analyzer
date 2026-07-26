import { describe, expect, it, vi } from 'vitest';

import { buildScriptBoardRouteProps } from './scriptBoardRouteProps';

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
    props.onOpenProductionCandidates({ videoId: 'video-1', title: '원본 제목', draftTitle: '내 제목' });
    props.onOpenUploadCalendar();

    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'home' }],
      [{
        id: 'studio-candidates',
        intent: {
          searchQuery: '내 제목',
          source: 'script-board',
          targetVideoId: 'video-1',
        },
      }],
      [{ id: 'studio-calendar' }],
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
});
