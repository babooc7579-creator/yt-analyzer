export const COMMENT_API_BUTTON_LABEL = '댓글 Top 10(API)';

export const COMMENT_API_BUTTON_TITLE = '댓글 Top 10 보기 - 버튼을 누를 때만 YouTube API로 댓글을 조회합니다. 저장 영상 불러오기와 다른 작업이며, 조회 결과를 Cloud에 저장하지 않습니다.';

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

const noop = () => {};

export const getCommentApiButtonProps = ({
  className,
  onFetchComments,
  video,
  videoTitle,
}) => {
  const safeVideo = toVideoObject(video);
  const displayTitle = videoTitle || safeVideo.title || '이 영상';
  const canFetchComments = Boolean(safeVideo.videoId) && typeof onFetchComments === 'function';

  return {
    className,
    disabled: !canFetchComments,
    onClick: canFetchComments
      ? () => onFetchComments(safeVideo.videoId, safeVideo.title)
      : noop,
    title: canFetchComments
      ? COMMENT_API_BUTTON_TITLE
      : '댓글을 조회할 영상 ID가 없어 YouTube API를 호출하지 않습니다.',
    'aria-label': `${displayTitle} 댓글 Top 10 보기 - YouTube API로 댓글 조회`,
    type: 'button',
  };
};
