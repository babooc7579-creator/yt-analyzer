import { PRODUCTION_STATUSES, hasAnyProductionStatus } from '../constants/status';
import { formatNumberedUrlList, getYouTubeVideoUrl } from './urls';

const toVideoObject = (video) => (
  video && typeof video === 'object' ? video : {}
);

const toRecordMap = (records) => (
  records && typeof records === 'object' ? records : {}
);

const getVideoId = (video) => toVideoObject(video).videoId;

export const getCloudScrapbookVideos = (videos) => (
  Array.isArray(videos) ? videos.filter(video => video && typeof video === 'object') : []
);

export const hasScrapbookVideo = (videos, videoId) => (
  getCloudScrapbookVideos(videos).some(video => getVideoId(video) === videoId)
);

export const removeScrapbookVideo = (videos, videoId) => (
  getCloudScrapbookVideos(videos).filter(video => getVideoId(video) !== videoId)
);

export const upsertScrapbookVideo = (videos, video) => {
  const nextVideo = toVideoObject(video);
  const videoId = getVideoId(nextVideo);
  if (!videoId) return getCloudScrapbookVideos(videos);

  return [
    ...removeScrapbookVideo(videos, videoId),
    nextVideo,
  ];
};

export const getScrapbookVideoUrlList = (savedVideos = []) => formatNumberedUrlList(
  getCloudScrapbookVideos(savedVideos)
    .filter((video) => getVideoId(video))
    .map((video) => [video.title || '제목 없는 영상', getYouTubeVideoUrl(video.videoId)])
);

export const getProductionScopedVideos = (savedVideos = [], videoUserRecords = {}) => {
  const records = toRecordMap(videoUserRecords);

  return getCloudScrapbookVideos(savedVideos).filter(video => hasAnyProductionStatus(
    records[getVideoId(video)],
    PRODUCTION_STATUSES,
  ));
};

export const getScrapbookWorkspaceViewProps = ({
  creatorView,
  discoveryLinks,
  copiedPrompt,
  promptCopyError,
  savedVideos,
  videoUserRecords,
  onCopyPrompt,
  onFetchComments,
  onMoveVideo,
  onOpenDiscoveryLinks,
  onOpenReferenceVault,
  onRemoveScrap,
  onUpdateDiscoveryLink,
  onUpdateVideoRecord,
}) => {
  const savedVideoList = getCloudScrapbookVideos(savedVideos);
  const isProductionView = creatorView === 'studio-candidates';
  const headerVideos = isProductionView
    ? getProductionScopedVideos(savedVideoList, videoUserRecords)
    : savedVideoList;
  const videoUrlList = getScrapbookVideoUrlList(headerVideos);

  return {
    getScrapbookVideoCardProps: (video) => ({
      video,
      onFetchComments,
      onRemoveScrap,
    }),
    headerProps: {
      savedVideoCount: headerVideos.length,
      copiedPrompt,
      promptCopyError,
      onCopyPrompt,
      videoUrlList,
      variant: isProductionView ? 'production' : 'scrapbook',
    },
    isProductionView,
    isScrapbookEmpty: savedVideoList.length === 0,
    productionKanbanProps: {
      discoveryLinks,
      videos: savedVideoList,
      videoUserRecords,
      onMoveVideo,
      onOpenDiscoveryLinks,
      onUpdateDiscoveryLink,
      onUpdateVideoRecord,
      onOpenReferenceVault,
    },
  };
};
