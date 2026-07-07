import { afterEach, describe, expect, it, vi } from 'vitest';

import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from './storage';

const installLocalStorageMock = (initialValues = {}) => {
  const store = new Map(Object.entries(initialValues));
  const localStorageMock = {
    getItem: vi.fn((key) => (store.has(key) ? store.get(key) : null)),
    setItem: vi.fn((key, value) => {
      store.set(key, value);
    }),
  };

  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  });

  return localStorageMock;
};

describe('storage service', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, 'localStorage');
    vi.restoreAllMocks();
  });

  it('keeps the expected localStorage keys stable', () => {
    expect(STORAGE_KEYS).toEqual({
      categories: 'yt_crm_categories',
      savedVideos: 'yt_crm_saved_videos',
      videoUserRecords: 'yt_crm_video_user_records',
    });
  });

  it('reads parsed JSON and falls back for missing or invalid values', () => {
    installLocalStorageMock({
      valid: JSON.stringify({ videoId: 'video-1' }),
      invalid: '{bad json',
    });

    expect(readJsonStorage('valid', {})).toEqual({ videoId: 'video-1' });
    expect(readJsonStorage('missing', ['fallback'])).toEqual(['fallback']);
    expect(readJsonStorage('invalid', { fallback: true })).toEqual({ fallback: true });
  });

  it('writes JSON values and reports success', () => {
    const localStorageMock = installLocalStorageMock();

    expect(writeJsonStorage('saved', [{ videoId: 'video-1' }])).toBe(true);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'saved',
      JSON.stringify([{ videoId: 'video-1' }]),
    );
  });

  it('falls back safely when browser storage is unavailable', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem: vi.fn(() => {
          throw new Error('blocked');
        }),
        setItem: vi.fn(() => {
          throw new Error('blocked');
        }),
      },
    });

    expect(readJsonStorage('blocked', { safe: true })).toEqual({ safe: true });
    expect(writeJsonStorage('blocked', { value: true })).toBe(false);
  });
});
