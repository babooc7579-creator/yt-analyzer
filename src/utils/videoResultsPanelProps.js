const toArray = (items) => (Array.isArray(items) ? items : []);

export const getVideoResultsPanelViewProps = ({
  checkedVideos,
  filteredVideos,
  isProductionCandidate,
  isVideoSaved,
  onFetchComments,
  onPromoteToProduction,
  onToggleCheck,
  onToggleScrap,
  showWorkPanel,
  videos,
}) => {
  const checkedVideoList = toArray(checkedVideos);
  const filteredVideoList = toArray(filteredVideos);
  const videoList = toArray(videos);

  const getVideoCardProps = (video, index) => ({
    video,
    rank: index + 1,
    isChecked: checkedVideoList.includes(video.videoId),
    isSaved: isVideoSaved(video.videoId),
    isProductionCandidate: isProductionCandidate(video.videoId),
    showWorkPanel,
    onToggleCheck,
    onToggleScrap,
    onPromoteToProduction,
    onFetchComments,
  });

  return {
    checkedVideoList,
    filteredVideoList,
    getVideoCardProps,
    listTableProps: {
      videos: filteredVideoList,
      checkedVideos: checkedVideoList,
      isVideoSaved,
      isProductionCandidate,
      toggleCheckVideo: onToggleCheck,
      toggleScrapVideo: onToggleScrap,
      promoteVideoToProduction: onPromoteToProduction,
      fetchTopComments: onFetchComments,
    },
    videoList,
  };
};
