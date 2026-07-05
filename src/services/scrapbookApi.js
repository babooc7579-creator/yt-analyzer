import { deleteJson, getJson, postJson } from './functionApiClient';

export const fetchScrapbook = () => getJson('/scrapbook');

export const saveScrapbookVideos = (videos) => (
  postJson('/scrapbook', { videos })
);

export const deleteScrapbookVideo = (videoId) => (
  deleteJson(`/scrapbook/${encodeURIComponent(videoId)}`)
);
