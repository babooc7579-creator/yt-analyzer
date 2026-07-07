export const EMPTY_COMMENT_MODAL = {
  comments: [],
  isOpen: false,
  loading: false,
  videoTitle: '',
};

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
