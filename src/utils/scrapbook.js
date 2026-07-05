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
