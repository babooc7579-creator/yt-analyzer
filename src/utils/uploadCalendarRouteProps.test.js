import { describe, expect, it, vi } from 'vitest';

import {
  buildUploadCalendarRouteProps,
  getUploadCalendarProductionSearchQuery,
  mergeUploadCalendarVideos,
} from './uploadCalendarRouteProps';

describe('buildUploadCalendarRouteProps', () => {
  it('opens the existing production candidate view for schedule changes', () => {
    const openCreatorView = vi.fn();
    const props = buildUploadCalendarRouteProps({
      creatorViewIntent: {
        targetPublishDate: '2026-08-04',
        targetVideoId: 'v1',
      },
      openCreatorView,
      videoUserRecords: { v1: {} },
      videos: [{ videoId: 'v1' }],
    });

    props.onOpenProductionCandidates();
    props.onOpenProductionCandidate({ title: '예약 영상', videoId: 'v1' });
    props.onOpenScriptBoard({ videoId: 'v1' });

    expect(openCreatorView.mock.calls).toEqual([
      [{ id: 'studio-candidates' }],
      [{
        id: 'studio-candidates',
        intent: { searchQuery: '예약 영상', source: 'upload-calendar', targetVideoId: 'v1' },
      }],
      [{
        id: 'studio-script',
        intent: { source: 'upload-calendar', targetVideoId: 'v1' },
      }],
    ]);
    expect(props).toMatchObject({
      initialTargetPublishDate: '2026-08-04',
      initialTargetVideoId: 'v1',
      videoUserRecords: { v1: {} },
      videos: [{ videoId: 'v1' }],
    });
  });

  it('uses the best available item label for the production search', () => {
    expect(getUploadCalendarProductionSearchQuery({ draftTitle: '초안 제목', title: '원본 제목' })).toBe('초안 제목');
    expect(getUploadCalendarProductionSearchQuery({ videoId: 'video-only' })).toBe('video-only');
  });

  it('keeps Cloud-saved production video details available when the current result list is empty', () => {
    expect(mergeUploadCalendarVideos({
      savedVideos: [{ videoId: 'v1', title: 'Cloud 제작 후보' }],
      videos: [],
    })).toEqual([
      { videoId: 'v1', title: 'Cloud 제작 후보' },
    ]);

    expect(mergeUploadCalendarVideos({
      savedVideos: [{ videoId: 'v1', title: '저장된 제목', thumbnail: 'saved.jpg' }],
      videos: [{ videoId: 'v1', title: '현재 제목', view_count: 100 }],
    })).toEqual([
      {
        videoId: 'v1',
        title: '현재 제목',
        thumbnail: 'saved.jpg',
        view_count: 100,
      },
    ]);
  });

  it('keeps older schedule items without a video id on the safe title fallback', () => {
    const openCreatorView = vi.fn();
    const props = buildUploadCalendarRouteProps({ openCreatorView });

    props.onOpenProductionCandidate({ title: '이전 일정 기록' });

    expect(openCreatorView).toHaveBeenCalledWith({
      id: 'studio-candidates',
      intent: {
        searchQuery: '이전 일정 기록',
        source: 'upload-calendar',
        targetVideoId: '',
      },
    });

    props.onOpenScriptBoard({ title: '이전 일정 기록' });

    expect(openCreatorView).toHaveBeenLastCalledWith({
      id: 'studio-script',
      intent: {
        source: 'upload-calendar',
        targetVideoId: '',
      },
    });
  });

  it('ignores an invalid calendar focus date without dropping the video target', () => {
    expect(buildUploadCalendarRouteProps({
      creatorViewIntent: {
        targetPublishDate: 'not-a-date',
        targetVideoId: 'v2',
      },
    })).toMatchObject({
      initialTargetPublishDate: '',
      initialTargetVideoId: 'v2',
    });
  });
});
