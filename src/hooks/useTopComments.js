import { useState } from 'react';
import { fetchTopComments as fetchTopCommentsFromYoutube } from '../services/youtubeApi';
import {
  EMPTY_COMMENT_MODAL,
  getYoutubeCommentErrorMessage,
  getYoutubeTopComments,
} from '../utils/topComments';

export function useTopComments({ apiKey, onError }) {
  const [commentModal, setCommentModal] = useState(EMPTY_COMMENT_MODAL);

  const closeTopCommentsModal = () => {
    setCommentModal(EMPTY_COMMENT_MODAL);
  };

  const fetchTopComments = async (videoId, videoTitle) => {
    if (!apiKey) {
      onError('댓글 Top 10 조회에는 YouTube API Key가 필요합니다. 이 기능은 YouTube API를 호출합니다.');
      return;
    }

    setCommentModal({ isOpen: true, videoTitle, comments: [], loading: true });

    try {
      const data = await fetchTopCommentsFromYoutube({ videoId, apiKey });
      if (data.error) {
        throw new Error(getYoutubeCommentErrorMessage(data.error));
      }

      const comments = getYoutubeTopComments(data.items);

      setCommentModal({ isOpen: true, videoTitle, comments, loading: false });
    } catch (err) {
      setCommentModal({ isOpen: true, videoTitle, comments: [], error: err.message, loading: false });
    }
  };

  return {
    closeTopCommentsModal,
    commentModal,
    fetchTopComments,
  };
}
