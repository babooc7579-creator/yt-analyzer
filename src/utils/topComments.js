export const EMPTY_COMMENT_MODAL = {
  comments: [],
  isOpen: false,
  loading: false,
  videoTitle: '',
};

const toArray = (items) => (Array.isArray(items) ? items : []);
const toModalObject = (modal) => (modal && typeof modal === 'object' ? modal : {});

export const getTopCommentsModalHeaderViewProps = ({
  onClose,
} = {}) => ({
  closeButtonProps: {
    'aria-label': '댓글 Top 10 창 닫기',
    onClick: onClose,
    title: '댓글 Top 10 창 닫기',
    type: 'button',
  },
  title: '찐팬 반응 분석 (Top 10)',
});

export const getTopCommentsModalBodyViewProps = (modal) => {
  const safeModal = toModalObject(modal);
  const comments = toArray(safeModal.comments);

  if (safeModal.loading) {
    return {
      comments,
      loadingText: '댓글 데이터를 불러오는 중...',
      state: 'loading',
    };
  }

  if (safeModal.error) {
    return {
      comments,
      errorText: safeModal.error,
      state: 'error',
    };
  }

  if (comments.length === 0) {
    return {
      comments,
      emptyText: '조회된 댓글이 없습니다.',
      state: 'empty',
    };
  }

  return {
    comments,
    state: 'ready',
  };
};

export const getTopCommentsModalVideoTitleViewProps = (videoTitle) => ({
  prefix: '원본 영상:',
  videoTitle: videoTitle || '',
});

export const getYoutubeCommentErrorMessage = (error) => {
  const reason = error?.errors?.[0]?.reason;
  if (reason === 'commentsDisabled') return '이 영상은 댓글이 사용 중지되었습니다.';
  return error?.message || '댓글을 불러오지 못했습니다.';
};

export const getYoutubeTopComments = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map(item => ({
    id: item.id,
    author: item.snippet.topLevelComment.snippet.authorDisplayName,
    text: item.snippet.topLevelComment.snippet.textOriginal,
    likeCount: item.snippet.topLevelComment.snippet.likeCount,
  }));
};
