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
      onUpdateVideoRecord: expect.any(Function),
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

  it('connects a discovery link candidate to script work and back to the same candidate', async () => {
    const openCreatorView = vi.fn();
    const updateVideoUserRecord = vi.fn(() => true);
    const link = {
      id: 'default:link-1',
      status: 'candidate',
      title: '발견 소재',
      url: 'https://example.com/source',
    };
    const props = buildScriptBoardRouteProps({
      creatorViewIntent: { targetDiscoveryLinkId: link.id },
      discoveryLinks: [link],
      openCreatorView,
      savedVideos: [],
      updateVideoUserRecord,
      videoUserRecords: {},
    });

    expect(props.initialTargetVideoId).toBe('discovery-link:default:link-1');
    expect(props.videos[0]).toMatchObject({
      discoveryLinkId: 'default:link-1',
      sourceType: 'discovery_link',
      sourceUrl: 'https://example.com/source',
      videoId: 'discovery-link:default:link-1',
    });
    expect(props.videoUserRecords['discovery-link:default:link-1']).toMatchObject({
      status: 'production_candidate',
    });

    await props.onUpdateVideoRecord('discovery-link:default:link-1', {
      scriptBody: '링크 기반 초안',
    });
    props.onOpenProductionCandidates(props.videos[0]);
    props.onOpenUploadCalendar({
      record: { targetPublishDate: '2026-08-05' },
      video: props.videos[0],
    });

    expect(updateVideoUserRecord).toHaveBeenCalledWith(
      'discovery-link:default:link-1',
      expect.objectContaining({
        scriptBody: '링크 기반 초안',
        status: 'production_candidate',
      }),
    );
    expect(openCreatorView.mock.calls).toEqual([
      [{
        id: 'studio-candidates',
        intent: {
          searchQuery: '발견 소재',
          source: 'script-board',
          targetDiscoveryLinkId: 'default:link-1',
        },
      }],
      [{
        id: 'studio-calendar',
        intent: {
          source: 'script-board',
          targetDiscoveryLinkId: 'default:link-1',
          targetPublishDate: '2026-08-05',
          targetVideoId: 'discovery-link:default:link-1',
        },
      }],
    ]);
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
