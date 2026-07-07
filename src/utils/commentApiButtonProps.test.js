import { describe, expect, it, vi } from 'vitest';

import {
  COMMENT_API_BUTTON_LABEL,
  COMMENT_API_BUTTON_TITLE,
  getCommentApiButtonProps,
} from './commentApiButtonProps';

describe('commentApiButtonProps utils', () => {
  it('builds YouTube API comment button props without calling eagerly', () => {
    const onFetchComments = vi.fn();
    const buttonProps = getCommentApiButtonProps({
      className: 'button-class',
      onFetchComments,
      video: { videoId: 'video-1', title: 'Original title' },
      videoTitle: 'Display title',
    });

    expect(buttonProps).toMatchObject({
      className: 'button-class',
      title: COMMENT_API_BUTTON_TITLE,
      'aria-label': 'Display title 댓글 Top 10 보기 - YouTube API로 댓글 조회',
      type: 'button',
    });
    expect(COMMENT_API_BUTTON_LABEL).toBe('댓글 Top 10(API)');
    expect(COMMENT_API_BUTTON_TITLE).toContain('YouTube API');
    expect(COMMENT_API_BUTTON_TITLE).toContain('저장 영상 불러오기');
    expect(onFetchComments).not.toHaveBeenCalled();

    buttonProps.onClick();

    expect(onFetchComments).toHaveBeenCalledWith('video-1', 'Original title');
  });

  it('uses safe title fallback for invalid video input', () => {
    const onFetchComments = vi.fn();
    const buttonProps = getCommentApiButtonProps({
      className: 'button-class',
      onFetchComments,
      video: null,
      videoTitle: '',
    });

    expect(buttonProps['aria-label']).toBe('이 영상 댓글 Top 10 보기 - YouTube API로 댓글 조회');

    buttonProps.onClick();

    expect(onFetchComments).toHaveBeenCalledWith(undefined, undefined);
  });
});
