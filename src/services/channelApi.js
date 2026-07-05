import { deleteJson, getJson, patchJson, postJson } from './functionApiClient';

const getChannelCategoryQuery = (category) => `category=${encodeURIComponent(category)}`;

const getChannelPath = ({ id, category, suffix = '' }) => (
  `/channels/${id}${suffix}?${getChannelCategoryQuery(category)}`
);

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
  deleteJson(getChannelPath({ id, category }))
);

export const updateChannel = ({ id, category, updates }) => (
  patchJson(getChannelPath({ id, category }), updates)
);

export const createChannelNote = ({ id, category, text }) => (
  postJson(getChannelPath({ id, category, suffix: '/notes' }), { text })
);

export const renameTag = ({ from, to }) => (
  getJson(`/tags/rename?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
);
