export const getVideoListRowContentViewProps = ({
  fetchTopComments,
  isChecked,
  isProductionCandidate,
  isSaved,
  isStrongReaction,
  isTtoTto,
  video,
  videoTitle,
  videoUrl,
}) => ({
  badgesProps: {
    isChecked,
    isProductionCandidate,
    isSaved,
    isStrongReaction,
    isTtoTto,
  },
  metaActionsProps: {
    fetchTopComments,
    video,
    videoTitle,
    videoUrl,
  },
  thumbnailProps: {
    video,
    videoTitle,
  },
  titleLinkProps: {
    videoTitle,
    videoUrl,
  },
});
