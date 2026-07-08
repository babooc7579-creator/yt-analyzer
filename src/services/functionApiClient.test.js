import { afterEach, describe, expect, it, vi } from 'vitest';

import { FUNCTION_API_BASE } from '../config';
import {
  FUNCTION_API_REQUEST_FAILED_MESSAGE,
  FUNCTION_API_RESPONSE_READ_FAILED_MESSAGE,
  deleteJson,
  getJson,
  patchJson,
  postJson,
} from './functionApiClient';

const installFetchMock = (response) => {
  const fetchMock = vi.fn(async () => response);
  Object.defineProperty(globalThis, 'fetch', {
    configurable: true,
    value: fetchMock,
  });
  return fetchMock;
};

const createResponse = ({ ok = true, status = 200, data, jsonThrows = false } = {}) => ({
  ok,
  status,
  json: vi.fn(async () => {
    if (jsonThrows) throw new Error('not json');
    return data;
  }),
});

describe('functionApiClient', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'fetch');
    vi.restoreAllMocks();
  });

  it('keeps Cloud API fallback copy centralized', () => {
    expect(FUNCTION_API_REQUEST_FAILED_MESSAGE).toBe('Cloud API 요청에 실패했습니다.');
    expect(FUNCTION_API_RESPONSE_READ_FAILED_MESSAGE).toBe(
      'Cloud API 응답을 읽지 못했습니다. 잠시 뒤 다시 시도해 주세요.'
    );
  });

  it('reads JSON responses from the configured Cloud API base URL', async () => {
    const response = createResponse({ data: { success: true, videos: [] } });
    const fetchMock = installFetchMock(response);

    await expect(getJson('/videos')).resolves.toEqual({ success: true, videos: [] });
    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/videos`);
  });

  it('sends JSON bodies with the expected HTTP methods', async () => {
    const response = createResponse({ data: { success: true } });
    const fetchMock = installFetchMock(response);

    await postJson('/video-records', { videoId: 'video-1' });
    expect(fetchMock).toHaveBeenLastCalledWith(`${FUNCTION_API_BASE}/video-records`, {
      method: 'POST',
      body: JSON.stringify({ videoId: 'video-1' }),
      headers: { 'Content-Type': 'application/json' },
    });

    await patchJson('/discovery-links/link-1', { status: 'saved' });
    expect(fetchMock).toHaveBeenLastCalledWith(`${FUNCTION_API_BASE}/discovery-links/link-1`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'saved' }),
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('sends delete requests without a request body', async () => {
    const response = createResponse({ data: { success: true } });
    const fetchMock = installFetchMock(response);

    await deleteJson('/scrapbook/video-1');
    expect(fetchMock).toHaveBeenCalledWith(`${FUNCTION_API_BASE}/scrapbook/video-1`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('normalizes failed HTTP responses into safe error payloads', async () => {
    installFetchMock(createResponse({
      ok: false,
      status: 500,
      data: { message: 'Server unavailable' },
    }));

    await expect(getJson('/video-records')).resolves.toEqual({
      success: false,
      error: 'Server unavailable',
      message: 'Server unavailable',
    });
  });

  it('returns a safe failure payload when JSON cannot be read', async () => {
    installFetchMock(createResponse({ jsonThrows: true }));

    const data = await getJson('/video-records');
    expect(data.success).toBe(false);
    expect(data.error).toEqual(expect.any(String));
  });
});
