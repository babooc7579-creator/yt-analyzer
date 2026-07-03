export const getYouTubeVideoUrl = (videoId) => (
  videoId ? `https://youtube.com/watch?v=${encodeURIComponent(videoId)}` : ''
);

export const getYouTubeChannelUrl = (channel) => {
  if (!channel) return '';
  if (channel.url) return channel.url;

  const handle = channel.handle || channel.customUrl || channel.username;
  if (handle) {
    if (/^https?:\/\//i.test(handle)) return handle;
    const normalizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    return `https://youtube.com/${normalizedHandle}`;
  }

  return channel.id ? `https://www.youtube.com/channel/${encodeURIComponent(channel.id)}` : '';
};
