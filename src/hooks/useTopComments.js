import { useState } from 'react';
import { fetchTopComments as fetchTopCommentsFromYoutube } from '../services/youtubeApi';

const EMPTY_COMMENT_MODAL = {
  comments: [],
  isOpen: false,
  loading: false,
  videoTitle: '',
};

export function useTopComments({ apiKey, onError }) {
  const [commentModal, setCommentModal] = useState(EMPTY_COMMENT_MODAL);

  const closeTopCommentsModal = () => {
    setCommentModal(EMPTY_COMMENT_MODAL);
  };

  const fetchTopComments = async (videoId, videoTitle) => {
    if (!apiKey) {
      onError('API Key가 필요합니다.');
      return;
    }

    setCommentModal({ isOpen: true, videoTitle, comments: [], loading: true });

    try {
      const data = await fetchTopCommentsFromYoutube({ videoId, apiKey });
      if (data.error) {
        if (data.error.errors[0].reason === 'commentsDisabled') throw new Error('이 영상은 댓글이 사용 중지되었습니다.');
        throw new Error(data.error.message);
      }

      const comments = data.items ? data.items.map(item => ({
        id: item.id,
        author: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textOriginal,
        likeCount: item.snippet.topLevelComment.snippet.likeCount,
      })) : [];

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
