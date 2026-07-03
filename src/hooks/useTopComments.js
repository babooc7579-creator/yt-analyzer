import { useState } from 'react';
import { fetchTopComments as fetchTopCommentsFromYoutube } from '../services/youtubeApi';

const EMPTY_COMMENT_MODAL = {
  comments: [],
  isOpen: false,
  loading: false,
  videoTitle: '',
};

const getYoutubeErrorMessage = (error) => {
  const reason = error?.errors?.[0]?.reason;
  if (reason === 'commentsDisabled') return '이 영상은 댓글이 사용 중지되었습니다.';
  return error?.message || '댓글을 불러오지 못했습니다.';
};

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
        throw new Error(getYoutubeErrorMessage(data.error));
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
