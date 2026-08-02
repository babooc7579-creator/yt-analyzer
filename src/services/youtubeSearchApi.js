import { getJson } from './functionApiClient';

export const searchYoutubeVideos = (options = {}) => {
  const params = new URLSearchParams();
  Object.entries(options).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  });
  return getJson(`/youtube-search?${params.toString()}`);
};
