import { formatNumberedUrlList, getYouTubeVideoUrl } from './urls';

export const getCloudScrapbookVideos = (videos) => videos || [];

export const hasScrapbookVideo = (videos, videoId) => (
  videos.some(video => video.videoId === videoId)
);

export const removeScrapbookVideo = (videos, videoId) => (
  videos.filter(video => video.videoId !== videoId)
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
  const videoUrlList = getScrapbookVideoUrlList(savedVideos);

  return {
    getScrapbookVideoCardProps: (video) => ({
      video,
      onFetchComments,
      onRemoveScrap,
    }),
    headerProps: {
      savedVideoCount: savedVideos.length,
      copiedPrompt,
      promptCopyError,
      onCopyPrompt,
      videoUrlList,
      variant: creatorView === 'studio-candidates' ? 'production' : 'scrapbook',
    },
    isProductionView: creatorView === 'studio-candidates',
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
