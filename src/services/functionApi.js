import { deleteJson, getJson, patchJson, postJson } from './functionApiClient';

export const fetchChannels = () => getJson('/channels');

export const fetchChannelPreview = (handle) => (
  getJson(`/channel-preview?handle=${encodeURIComponent(handle)}`)
);

export const createChannel = ({ handle, tags, language, note }) => (
  postJson('/channels', { handle, tags, language, note })
);

export const createChannelsBulk = ({ handles, tags, language }) => (
  postJson('/channels/bulk', { handles, tags, language })
);

export const removeChannel = ({ id, category }) => (
  deleteJson(`/channels/${id}?category=${encodeURIComponent(category)}`)
);

export const updateChannel = ({ id, category, updates }) => (
  patchJson(`/channels/${id}?category=${encodeURIComponent(category)}`, updates)
);

export const createChannelNote = ({ id, category, text }) => (
  postJson(`/channels/${id}/notes?category=${encodeURIComponent(category)}`, { text })
);

export const fetchStoredVideosByChannelIds = (channelIds) => (
  getJson(`/videos?channelIds=${channelIds.join(',')}`)
);

export const scanSelectedChannels = (channelIds) => (
  postJson('/scan/selected', { channelIds, reason: 'manual' })
);

export const scanChannels = ({ tag } = {}) => (
  getJson(tag ? `/scan?tag=${encodeURIComponent(tag)}` : '/scan')
);

export const renameTag = ({ from, to }) => (
  getJson(`/tags/rename?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
);

export const fetchScrapbook = () => getJson('/scrapbook');

export const saveScrapbookVideos = (videos) => (
  postJson('/scrapbook', { videos })
);

export const deleteScrapbookVideo = (videoId) => (
  deleteJson(`/scrapbook/${encodeURIComponent(videoId)}`)
);

export const fetchVideoUserRecords = () => getJson('/video-records');

export const saveVideoUserRecord = (record) => (
  postJson('/video-records', record)
);

export const clearVideoUserRecords = () => (
  deleteJson('/video-records')
);

export const fetchDiscoveryLinks = () => getJson('/discovery-links');

export const createDiscoveryLink = (link) => (
  postJson('/discovery-links', link)
);

export const updateDiscoveryLink = ({ id, updates }) => (
  patchJson(`/discovery-links/${encodeURIComponent(id)}`, updates)
);

export const deleteDiscoveryLink = (id) => (
  deleteJson(`/discovery-links/${encodeURIComponent(id)}`)
);
