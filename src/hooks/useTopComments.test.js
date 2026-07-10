import { beforeEach, describe, expect, it, vi } from 'vitest';

const { fetchTopCommentsMock, stateSetters } = vi.hoisted(() => ({
  fetchTopCommentsMock: vi.fn(),
  stateSetters: [],
}));

vi.mock('react', () => ({
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);
    return [initialValue, setter];
  }),
}));

vi.mock('../services/youtubeApi', () => ({
  fetchTopComments: fetchTopCommentsMock,
}));

import { useState } from 'react';
import { fetchTopComments as fetchTopCommentsFromYoutube } from '../services/youtubeApi';
import {
  EMPTY_COMMENT_MODAL,
  TOP_COMMENTS_API_KEY_REQUIRED_MESSAGE,
} from '../utils/topComments';
import { useTopComments } from './useTopComments';

const youtubeCommentItem = {
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
};

describe('useTopComments', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    vi.clearAllMocks();
  });

  it('initializes and closes the comment modal with safe empty state', () => {
    const commentsHook = useTopComments({
      apiKey: 'youtube-key',
      onError: vi.fn(),
    });

    expect(useState).toHaveBeenCalledWith(EMPTY_COMMENT_MODAL);
    expect(commentsHook.commentModal).toBe(EMPTY_COMMENT_MODAL);

    commentsHook.closeTopCommentsModal();

    expect(stateSetters[0]).toHaveBeenCalledWith(EMPTY_COMMENT_MODAL);
  });

  it('does not call YouTube comments API when the API key is missing', async () => {
    const onError = vi.fn();
    const commentsHook = useTopComments({
      apiKey: '',
      onError,
    });

    await commentsHook.fetchTopComments('video-1', 'Video title');

    expect(onError).toHaveBeenCalledWith(TOP_COMMENTS_API_KEY_REQUIRED_MESSAGE);
    expect(fetchTopCommentsFromYoutube).not.toHaveBeenCalled();
    expect(stateSetters[0]).not.toHaveBeenCalled();
  });

  it('opens loading state, fetches YouTube comments, and stores mapped top comments', async () => {
    fetchTopCommentsMock.mockResolvedValueOnce({
      items: [youtubeCommentItem],
    });
    const commentsHook = useTopComments({
      apiKey: 'youtube-key',
      onError: vi.fn(),
    });

    await commentsHook.fetchTopComments('video-1', 'Video title');

    expect(stateSetters[0]).toHaveBeenNthCalledWith(1, {
      isOpen: true,
      videoTitle: 'Video title',
      comments: [],
      loading: true,
    });
    expect(fetchTopCommentsFromYoutube).toHaveBeenCalledWith({
      apiKey: 'youtube-key',
      videoId: 'video-1',
    });
    expect(stateSetters[0]).toHaveBeenNthCalledWith(2, {
      isOpen: true,
      videoTitle: 'Video title',
      comments: [
        {
          id: 'comment-1',
          author: 'Viewer',
          text: 'Great idea',
          likeCount: 12,
        },
      ],
      loading: false,
    });
  });

  it('shows a user-friendly modal error when YouTube returns an API error payload', async () => {
    fetchTopCommentsMock.mockResolvedValueOnce({
      error: {
        errors: [{ reason: 'commentsDisabled' }],
        message: 'comments disabled',
      },
    });
    const commentsHook = useTopComments({
      apiKey: 'youtube-key',
      onError: vi.fn(),
    });

    await commentsHook.fetchTopComments('video-1', 'Video title');

    expect(stateSetters[0]).toHaveBeenLastCalledWith({
      isOpen: true,
      videoTitle: 'Video title',
      comments: [],
      error: '이 영상은 댓글이 사용 중지되었습니다.',
      loading: false,
    });
  });

  it('keeps the modal open with an error message when the YouTube request fails', async () => {
    fetchTopCommentsMock.mockRejectedValueOnce(new Error('network failed'));
    const commentsHook = useTopComments({
      apiKey: 'youtube-key',
      onError: vi.fn(),
    });

    await commentsHook.fetchTopComments('video-1', 'Video title');

    expect(stateSetters[0]).toHaveBeenLastCalledWith({
      isOpen: true,
      videoTitle: 'Video title',
      comments: [],
      error: 'network failed',
      loading: false,
    });
  });
});
