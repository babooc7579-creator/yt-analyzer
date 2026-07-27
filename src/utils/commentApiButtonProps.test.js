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
      disabled: false,
      title: COMMENT_API_BUTTON_TITLE,
      'aria-label': 'Display title 댓글 Top 10 보기 - YouTube API로 댓글 조회',
      type: 'button',
    });
    expect(COMMENT_API_BUTTON_LABEL).toBe('댓글 Top 10(API)');
    expect(COMMENT_API_BUTTON_TITLE).toContain('YouTube API');
    expect(COMMENT_API_BUTTON_TITLE).toContain('버튼을 누를 때만');
    expect(COMMENT_API_BUTTON_TITLE).toContain('수집 영상 목록 불러오기');
    expect(COMMENT_API_BUTTON_TITLE).toContain('Cloud에 저장하지 않습니다');
    expect(onFetchComments).not.toHaveBeenCalled();

    buttonProps.onClick();

    expect(onFetchComments).toHaveBeenCalledWith('video-1', 'Original title');
  });

  it('disables the button when the video id is missing', () => {
    const onFetchComments = vi.fn();
    const buttonProps = getCommentApiButtonProps({
      className: 'button-class',
      onFetchComments,
      video: null,
      videoTitle: '',
    });

    expect(buttonProps).toMatchObject({
      disabled: true,
      title: '댓글을 조회할 영상 ID가 없어 YouTube API를 호출하지 않습니다.',
    });
    expect(buttonProps['aria-label']).toBe('이 영상 댓글 Top 10 보기 - YouTube API로 댓글 조회');

    buttonProps.onClick();

    expect(onFetchComments).not.toHaveBeenCalled();
  });

  it('disables the button when the fetch handler is missing', () => {
    const buttonProps = getCommentApiButtonProps({
      video: { videoId: 'video-2', title: 'Clip' },
    });

    expect(buttonProps.disabled).toBe(true);

    buttonProps.onClick();
  });
});
