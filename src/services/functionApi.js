import { FUNCTION_API_BASE } from '../config';

const getJson = async (path) => {
  const response = await fetch(`${FUNCTION_API_BASE}${path}`);
  return response.json();
};

const sendJson = async (path, options = {}) => {
  const response = await fetch(`${FUNCTION_API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  return response.json();
};

export const fetchChannels = () => getJson('/channels');

export const fetchChannelPreview = (handle) => (
  getJson(`/channel-preview?handle=${encodeURIComponent(handle)}`)
);

export const createChannel = ({ handle, tags, language, note }) => (
  sendJson('/channels', {
    method: 'POST',
    body: JSON.stringify({ handle, tags, language, note }),
  })
);

export const createChannelsBulk = ({ handles, tags, language }) => (
  sendJson('/channels/bulk', {
    method: 'POST',
    body: JSON.stringify({ handles, tags, language }),
  })
);

export const removeChannel = ({ id, category }) => (
  sendJson(`/channels/${id}?category=${encodeURIComponent(category)}`, {
    method: 'DELETE',
  })
);

export const updateChannel = ({ id, category, updates }) => (
  sendJson(`/channels/${id}?category=${encodeURIComponent(category)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
);

export const createChannelNote = ({ id, category, text }) => (
  sendJson(`/channels/${id}/notes?category=${encodeURIComponent(category)}`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
);

export const fetchStoredVideosByChannelIds = (channelIds) => (
  getJson(`/videos?channelIds=${channelIds.join(',')}`)
);

export const scanSelectedChannels = (channelIds) => (
  sendJson('/scan/selected', {
    method: 'POST',
    body: JSON.stringify({ channelIds, reason: 'manual' }),
  })
);

export const scanChannels = ({ tag } = {}) => (
  getJson(tag ? `/scan?tag=${encodeURIComponent(tag)}` : '/scan')
);

export const renameTag = ({ from, to }) => (
  getJson(`/tags/rename?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
);

export const fetchScrapbook = () => getJson('/scrapbook');

export const saveScrapbookVideos = (videos) => (
  sendJson('/scrapbook', {
    method: 'POST',
    body: JSON.stringify({ videos }),
  })
);

export const deleteScrapbookVideo = (videoId) => (
  sendJson(`/scrapbook/${encodeURIComponent(videoId)}`, {
    method: 'DELETE',
  })
);

export const fetchVideoUserRecords = () => getJson('/video-records');

export const saveVideoUserRecord = (record) => (
  sendJson('/video-records', {
    method: 'POST',
    body: JSON.stringify(record),
  })
);

export const clearVideoUserRecords = () => (
  sendJson('/video-records', {
    method: 'DELETE',
  })
);

export const fetchDiscoveryLinks = () => getJson('/discovery-links');

export const createDiscoveryLink = (link) => (
  sendJson('/discovery-links', {
    method: 'POST',
    body: JSON.stringify(link),
  })
);

export const updateDiscoveryLink = ({ id, updates }) => (
  sendJson(`/discovery-links/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
);

export const deleteDiscoveryLink = (id) => (
  sendJson(`/discovery-links/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
);
