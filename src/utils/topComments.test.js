import { describe, expect, it } from 'vitest';

import {
  EMPTY_COMMENT_MODAL,
  TOP_COMMENTS_API_KEY_REQUIRED_MESSAGE,
  getTopCommentsModalBodyViewProps,
  getTopCommentsModalHeaderViewProps,
  getTopCommentsModalVideoTitleViewProps,
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
    expect(TOP_COMMENTS_API_KEY_REQUIRED_MESSAGE).toContain('YouTube API Key');
    expect(TOP_COMMENTS_API_KEY_REQUIRED_MESSAGE).toContain('YouTube API를 호출');

    expect(getYoutubeCommentErrorMessage({
      errors: [{ reason: 'commentsDisabled' }],
      message: 'comments disabled',
    })).toBe('이 영상은 댓글이 사용 중지되었습니다.');

    expect(getYoutubeCommentErrorMessage({ message: 'quota exceeded' })).toBe('quota exceeded');
    expect(getYoutubeCommentErrorMessage()).toBe('댓글을 불러오지 못했습니다.');
  });

  it('builds top comments modal header, body, and video title props', () => {
    const onClose = () => 'close';
    const headerProps = getTopCommentsModalHeaderViewProps({ onClose });

    expect(headerProps.title).toBe('찐팬 반응 분석 (Top 10)');
    expect(headerProps.closeButtonProps).toMatchObject({
      'aria-label': '댓글 Top 10 창 닫기',
      onClick: onClose,
      title: '댓글 Top 10 창 닫기',
      type: 'button',
    });
    expect(getTopCommentsModalBodyViewProps({ loading: true })).toEqual({
      comments: [],
      loadingText: '댓글 데이터를 불러오는 중...',
      state: 'loading',
    });
    expect(getTopCommentsModalBodyViewProps({ error: 'API error' })).toEqual({
      comments: [],
      errorText: 'API error',
      state: 'error',
    });
    expect(getTopCommentsModalBodyViewProps()).toEqual({
      comments: [],
      emptyText: '조회된 댓글이 없습니다.',
      state: 'empty',
    });
    expect(getTopCommentsModalBodyViewProps({
      comments: [{ id: 'comment-1' }],
    })).toEqual({
      comments: [{ id: 'comment-1' }],
      state: 'ready',
    });
    expect(getTopCommentsModalVideoTitleViewProps('Video title')).toEqual({
      prefix: '원본 영상:',
      videoTitle: 'Video title',
    });
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
