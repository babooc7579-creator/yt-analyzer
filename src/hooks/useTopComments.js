import { useState } from 'react';
import { fetchTopComments as fetchTopCommentsFromYoutube } from '../services/youtubeApi';
import {
  EMPTY_COMMENT_MODAL,
  TOP_COMMENTS_API_KEY_REQUIRED_MESSAGE,
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
      onError(TOP_COMMENTS_API_KEY_REQUIRED_MESSAGE);
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
