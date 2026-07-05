import { PRODUCTION_STATUSES, hasAnyProductionStatus } from '../constants/status';
import { formatNumberedUrlList, getYouTubeVideoUrl } from './urls';

export const getCloudScrapbookVideos = (videos) => (
  Array.isArray(videos) ? videos : []
);

export const hasScrapbookVideo = (videos, videoId) => (
  getCloudScrapbookVideos(videos).some(video => video.videoId === videoId)
);

export const removeScrapbookVideo = (videos, videoId) => (
  getCloudScrapbookVideos(videos).filter(video => video.videoId !== videoId)
);

export const upsertScrapbookVideo = (videos, video) => [
  ...removeScrapbookVideo(videos, video.videoId),
  video,
];

export const getScrapbookVideoUrlList = (savedVideos = []) => formatNumberedUrlList(
  savedVideos
    .filter((video) => video.videoId)
    .map((video) => [video.title || '제목 없는 영상', getYouTubeVideoUrl(video.videoId)])
);

export const getProductionScopedVideos = (savedVideos = [], videoUserRecords = {}) => (
  savedVideos.filter(video => hasAnyProductionStatus(
    videoUserRecords[video.videoId],
    PRODUCTION_STATUSES,
  ))
);

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
  const isProductionView = creatorView === 'studio-candidates';
  const headerVideos = isProductionView
    ? getProductionScopedVideos(savedVideos, videoUserRecords)
    : savedVideos;
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
    isScrapbookEmpty: savedVideos.length === 0,
    productionKanbanProps: {
      discoveryLinks,
      videos: savedVideos,
      videoUserRecords,
      onMoveVideo,
      onOpenDiscoveryLinks,
      onUpdateDiscoveryLink,
      onUpdateVideoRecord,
      onOpenReferenceVault,
    },
  };
};
