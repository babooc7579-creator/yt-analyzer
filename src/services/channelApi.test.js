import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  createChannel,
  createChannelNote,
  createChannelsBulk,
  fetchChannelPreview,
  fetchChannels,
  removeChannel,
  renameTag,
  updateChannel,
} from './channelApi';

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

describe('channelApi service', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('loads Cloud channels and channel previews', async () => {
    const fetchMock = installFetchMock();

    await fetchChannels();
    expect(fetchMock).toHaveBeenLastCalledWith(`${FUNCTION_API_BASE}/channels`);

    await fetchChannelPreview('@creator/a b');
    expect(fetchMock).toHaveBeenLastCalledWith(
      `${FUNCTION_API_BASE}/channel-preview?handle=%40creator%2Fa%20b`,
    );
  });

  it('creates single and bulk channel records with expected payloads', async () => {
    const fetchMock = installFetchMock();
    const channelPayload = {
      handle: '@creator',
      tags: ['shorts'],
      language: 'en',
      note: 'watch this',
    };

    await createChannel(channelPayload);
    expect(fetchMock).toHaveBeenLastCalledWith(`${FUNCTION_API_BASE}/channels`, {
      method: 'POST',
      body: JSON.stringify(channelPayload),
      headers: { 'Content-Type': 'application/json' },
    });

    const bulkPayload = {
      handles: ['@one', '@two'],
      tags: ['shorts'],
      language: 'en',
    };

    await createChannelsBulk(bulkPayload);
    expect(fetchMock).toHaveBeenLastCalledWith(`${FUNCTION_API_BASE}/channels/bulk`, {
      method: 'POST',
      body: JSON.stringify(bulkPayload),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('updates and removes channels through category-scoped routes', async () => {
    const fetchMock = installFetchMock();
    const updates = { grade: 'A', status: 'active' };

    await updateChannel({ id: 'channel-1', category: 'shorts/a b', updates });
    expect(fetchMock).toHaveBeenLastCalledWith(
      `${FUNCTION_API_BASE}/channels/channel-1?category=shorts%2Fa%20b`,
      {
        method: 'PATCH',
        body: JSON.stringify(updates),
        headers: { 'Content-Type': 'application/json' },
      },
    );

    await removeChannel({ id: 'channel-1', category: 'shorts/a b' });
    expect(fetchMock).toHaveBeenLastCalledWith(
      `${FUNCTION_API_BASE}/channels/channel-1?category=shorts%2Fa%20b`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  it('creates channel notes through the category-scoped notes route', async () => {
    const fetchMock = installFetchMock();

    await createChannelNote({
      id: 'channel-1',
      category: 'shorts/a b',
      text: 'new note',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${FUNCTION_API_BASE}/channels/channel-1/notes?category=shorts%2Fa%20b`,
      {
        method: 'POST',
        body: JSON.stringify({ text: 'new note' }),
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  it('renames tags through encoded query parameters', async () => {
    const fetchMock = installFetchMock();

    await renameTag({ from: 'old/a b', to: 'new tag' });

    expect(fetchMock).toHaveBeenCalledWith(
      `${FUNCTION_API_BASE}/tags/rename?from=old%2Fa%20b&to=new%20tag`,
    );
  });
});
