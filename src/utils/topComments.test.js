import { describe, expect, it } from 'vitest';

import {
  EMPTY_COMMENT_MODAL,
  getYoutubeCommentErrorMessage,
  getYoutubeTopComments,
} from './topComments';

describe('topComments utils', () => {
  it('keeps the default comment modal closed and empty', () => {
    expect(EMPTY_COMMENT_MODAL).toEqual({
      comments: [],
      isOpen: false,
      loading: false,
      videoTitle: '',
    });
  });

  it('builds user-facing YouTube comment error messages', () => {
    expect(getYoutubeCommentErrorMessage({
      errors: [{ reason: 'commentsDisabled' }],
      message: 'comments disabled',
    })).toBe('이 영상은 댓글이 사용 중지되었습니다.');

    expect(getYoutubeCommentErrorMessage({ message: 'quota exceeded' })).toBe('quota exceeded');
    expect(getYoutubeCommentErrorMessage()).toBe('댓글을 불러오지 못했습니다.');
  });

  it('maps YouTube commentThreads items into modal comments', () => {
    expect(getYoutubeTopComments([
      {
        id: 'comment-1',
        snippet: {
          topLevelComment: {
            snippet: {
              authorDisplayName: 'Viewer',
              textOriginal: 'Great idea',
              likeCount: 12,
            },
          },
        },
      },
    ])).toEqual([
      {
        id: 'comment-1',
        author: 'Viewer',
        text: 'Great idea',
        likeCount: 12,
      },
    ]);
  });

  it('treats missing comment items as an empty list', () => {
    expect(getYoutubeTopComments()).toEqual([]);
    expect(getYoutubeTopComments(null)).toEqual([]);
    expect(getYoutubeTopComments({ items: [] })).toEqual([]);
  });
});
