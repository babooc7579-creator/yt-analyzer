import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  createDiscoveryLink,
  deleteDiscoveryLink,
  fetchDiscoveryLinks,
  updateDiscoveryLink,
} from './discoveryLinksApi';

const installFetchMock = () => {
  const fetchMock = vi.fn(async () => ({
    ok: true,
    json: vi.fn(async () => ({ success: true })),
  }));

  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: fetchMock,
  });

  return fetchMock;
};

describe('discoveryLinksApi service', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('loads the Cloud discovery links endpoint', async () => {
    const fetchMock = installFetchMock();

    await fetchDiscoveryLinks();

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/discovery-links`);
  });

  it('creates discovery links with the expected payload shape', async () => {
    const fetchMock = installFetchMock();
    const link = { url: 'https://example.com/video', title: 'Found link' };

    await createDiscoveryLink(link);

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/discovery-links`, {
      method: 'POST',
      body: JSON.stringify(link),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('updates discovery links with an encoded id route', async () => {
    const fetchMock = installFetchMock();
    const updates = { status: 'candidate', rightsStatus: 'needs_check' };

    await updateDiscoveryLink({ id: 'link/id 1', updates });

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/discovery-links/link%2Fid%201`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('deletes discovery links with an encoded id route', async () => {
    const fetchMock = installFetchMock();

    await deleteDiscoveryLink('link/id 1');

    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/discovery-links/link%2Fid%201`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  });
});
