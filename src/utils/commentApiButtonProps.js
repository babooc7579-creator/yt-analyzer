export const COMMENT_API_BUTTON_LABEL = '댓글 Top 10(API)';

export const COMMENT_API_BUTTON_TITLE = '댓글 Top 10 보기 - YouTube API로 댓글을 조회합니다. 저장 영상 불러오기와 다른 작업입니다.';

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

export const getCommentApiButtonProps = ({
  className,
  onFetchComments,
  video,
  videoTitle,
}) => {
  const safeVideo = toVideoObject(video);
  const displayTitle = videoTitle || safeVideo.title || '이 영상';

  return {
    className,
    onClick: () => onFetchComments(safeVideo.videoId, safeVideo.title),
    title: COMMENT_API_BUTTON_TITLE,
    'aria-label': `${displayTitle} 댓글 Top 10 보기 - YouTube API로 댓글 조회`,
    type: 'button',
  };
};
