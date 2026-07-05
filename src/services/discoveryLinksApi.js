import { deleteJson, getJson, patchJson, postJson } from './functionApiClient';

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
