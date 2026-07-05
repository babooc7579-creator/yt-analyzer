export const VIDEO_LIST_TABLE_HEADERS = [
  { key: 'ai-select', label: 'AI 선택', className: 'px-3 py-3 text-center' },
  { key: 'material', label: '소재', className: 'px-2 py-3 text-center' },
  { key: 'video-info', label: '영상 정보', className: 'px-3 py-3' },
  { key: 'production', label: '제작', className: 'px-3 py-3 text-center' },
  { key: 'views', label: '총 조회수', className: 'px-3 py-3 text-right' },
  { key: 'score', label: '대박 지수', className: 'px-3 py-3 text-right text-indigo-700 font-bold' },
  { key: 'engagement', label: '참여율', className: 'px-3 py-3 text-right text-rose-600 font-bold' },
  { key: 'days-old', label: '경과일', className: 'px-3 py-3 text-right' },
];

const toArray = (items) => (Array.isArray(items) ? items : []);

export const getVideoListTableViewProps = ({
  checkedVideos,
  isProductionCandidate,
  isVideoSaved,
  fetchTopComments,
  promoteVideoToProduction,
  toggleCheckVideo,
  toggleScrapVideo,
}) => {
  const checkedVideoList = toArray(checkedVideos);

  return {
    headers: VIDEO_LIST_TABLE_HEADERS,
    getRowProps: (video) => ({
      fetchTopComments,
      isChecked: checkedVideoList.includes(video.videoId),
      isProductionCandidate: isProductionCandidate(video.videoId),
      isSaved: isVideoSaved(video.videoId),
      promoteVideoToProduction,
      toggleCheckVideo,
      toggleScrapVideo,
      video,
    }),
  };
};
