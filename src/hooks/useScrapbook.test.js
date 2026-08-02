import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  deleteScrapbookVideoMock,
  effectCleanups,
  fetchScrapbookMock,
  readJsonStorageMock,
  saveScrapbookVideosMock,
  stateOverrides,
  stateSetters,
  writeJsonStorageMock,
} = vi.hoisted(() => ({
  deleteScrapbookVideoMock: vi.fn(),
  effectCleanups: [],
  fetchScrapbookMock: vi.fn(),
  readJsonStorageMock: vi.fn(),
  saveScrapbookVideosMock: vi.fn(),
  stateOverrides: [],
  stateSetters: [],
  writeJsonStorageMock: vi.fn(),
}));

vi.mock('react', () => ({
  useEffect: vi.fn((effect) => {
    const cleanup = effect();
    if (typeof cleanup === 'function') effectCleanups.push(cleanup);
  }),
  useRef: vi.fn((initialValue) => ({ current: initialValue })),
  useMemo: vi.fn(factory => factory()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const stateValue = stateOverrides.length
      ? stateOverrides.shift()
      : (typeof initialValue === 'function' ? initialValue() : initialValue);

    return [stateValue, setter];
  }),
}));

vi.mock('../services/scrapbookApi', () => ({
  deleteScrapbookVideo: deleteScrapbookVideoMock,
  fetchScrapbook: fetchScrapbookMock,
  saveScrapbookVideos: saveScrapbookVideosMock,
}));

vi.mock('../services/storage', () => ({
  STORAGE_KEYS: {
    savedVideos: 'yt_crm_saved_videos',
  },
  readJsonStorage: readJsonStorageMock,
  writeJsonStorage: writeJsonStorageMock,
}));

import { useEffect, useMemo, useRef, useState } from 'react';
import { SCRAPBOOK_SYNC_WARNINGS } from '../constants/syncWarnings';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import {
  deleteScrapbookVideo,
  fetchScrapbook,
  saveScrapbookVideos,
} from '../services/scrapbookApi';
import { useScrapbook } from './useScrapbook';

const savedVideo = {
  videoId: 'video-1',
  title: 'Saved video',
};

const secondVideo = {
  videoId: 'video-2',
  title: 'Second video',
};

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const setScrapbookState = ({
  cloudReady = false,
  savedVideos = [],
  warning = '',
} = {}) => {
  stateOverrides.push(savedVideos, cloudReady, warning);
};

describe('useScrapbook', () => {
  beforeEach(() => {
    effectCleanups.length = 0;
    stateOverrides.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();

    deleteScrapbookVideoMock.mockReset();
    fetchScrapbookMock.mockReset();
    readJsonStorageMock.mockReset();
    saveScrapbookVideosMock.mockReset();
    writeJsonStorageMock.mockReset();

    deleteScrapbookVideoMock.mockResolvedValue({ success: true });
    fetchScrapbookMock.mockResolvedValue({
      success: true,
      videos: [],
    });
    readJsonStorageMock.mockReturnValue([]);
    saveScrapbookVideosMock.mockResolvedValue({ success: true });
    writeJsonStorageMock.mockReturnValue(true);
  });

  it('uses Cloud scrapbook videos as the source of truth when Cloud load succeeds', async () => {
    fetchScrapbookMock.mockResolvedValueOnce({
      success: true,
      videos: [savedVideo, null, 'bad'],
    });

    useScrapbook();
    await flushPromises();

    expect(useRef).toHaveBeenCalledWith([]);
    expect(useMemo).toHaveBeenCalled();
    expect(useState).toHaveBeenNthCalledWith(1, []);
    expect(fetchScrapbook).toHaveBeenCalledTimes(1);
    expect(readJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledWith([savedVideo]);
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.savedVideos, [savedVideo]);
    expect(stateSetters[1]).toHaveBeenCalledWith(true);
    expect(stateSetters[2]).toHaveBeenCalledWith('');
  });

  it('does not replace an empty successful Cloud response with localStorage scrapbook videos', async () => {
    fetchScrapbookMock.mockResolvedValueOnce({
      success: true,
      videos: [],
    });
    readJsonStorageMock.mockReturnValueOnce([savedVideo]);

    useScrapbook();
    await flushPromises();

    expect(readJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledWith([]);
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.savedVideos, []);
    expect(stateSetters[1]).toHaveBeenCalledWith(true);
    expect(stateSetters[2]).toHaveBeenCalledWith('');
  });

  it('falls back to localStorage only when Cloud scrapbook load fails', async () => {
    fetchScrapbookMock.mockRejectedValueOnce(new Error('network failed'));
    readJsonStorageMock.mockReturnValueOnce([savedVideo, null, secondVideo]);

    useScrapbook();
    await flushPromises();

    expect(readJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.savedVideos, []);
    expect(stateSetters[0]).toHaveBeenCalledWith([savedVideo, secondVideo]);
    expect(stateSetters[1]).toHaveBeenCalledWith(false);
    expect(stateSetters[2]).toHaveBeenCalledWith(SCRAPBOOK_SYNC_WARNINGS.loadFallback);
    expect(writeJsonStorage).not.toHaveBeenCalled();
  });

  it('retries only the Cloud read and restores the online scrapbook state', async () => {
    fetchScrapbookMock
      .mockRejectedValueOnce(new Error('network failed'))
      .mockResolvedValueOnce({
        success: true,
        videos: [savedVideo],
      });
    const scrapbook = useScrapbook();
    await flushPromises();

    const recovered = await scrapbook.retryScrapbookSync();

    expect(recovered).toBe(true);
    expect(fetchScrapbook).toHaveBeenCalledTimes(2);
    expect(saveScrapbookVideos).not.toHaveBeenCalled();
    expect(deleteScrapbookVideo).not.toHaveBeenCalled();
    expect(stateSetters[1]).toHaveBeenLastCalledWith(true);
    expect(stateSetters[2]).toHaveBeenLastCalledWith('');
  });

  it('does not silently save to localStorage when Cloud scrapbook is not ready', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    const scrapbook = useScrapbook();

    const changed = await scrapbook.toggleScrapVideo(savedVideo);

    expect(changed).toBe(false);
    expect(saveScrapbookVideos).not.toHaveBeenCalled();
    expect(deleteScrapbookVideo).not.toHaveBeenCalled();
    expect(writeJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[2]).toHaveBeenCalledWith(SCRAPBOOK_SYNC_WARNINGS.cloudRequired);
  });

  it('saves an unsaved video through Cloud before updating the local cache', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [] });
    const scrapbook = useScrapbook();

    const changed = await scrapbook.toggleScrapVideo(savedVideo);

    expect(changed).toBe(true);
    const materialVideo = { ...savedVideo, scrapbookPurposes: ['material'] };
    expect(saveScrapbookVideos).toHaveBeenCalledWith([materialVideo]);
    expect(deleteScrapbookVideo).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledWith([materialVideo]);
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.savedVideos, [materialVideo]);
    expect(stateSetters[2]).toHaveBeenCalledWith('');
  });

  it('deletes a saved video through Cloud before updating the local cache', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [savedVideo] });
    const scrapbook = useScrapbook();

    const changed = await scrapbook.toggleScrapVideo(savedVideo);

    expect(changed).toBe(true);
    expect(deleteScrapbookVideo).toHaveBeenCalledWith('video-1');
    expect(saveScrapbookVideos).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledWith([]);
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.savedVideos, []);
    expect(stateSetters[2]).toHaveBeenCalledWith('');
  });

  it('removes only the material purpose for a production candidate', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    const storedVideo = { ...savedVideo, savedAt: '2026-07-01T00:00:00.000Z' };
    const currentVideo = { ...storedVideo, title: 'Current title', view_count: 25 };
    setScrapbookState({ cloudReady: true, savedVideos: [storedVideo] });
    const scrapbook = useScrapbook();

    const changed = await scrapbook.toggleScrapVideo(currentVideo, {
      preserveForProduction: true,
    });

    const productionVideo = {
      ...storedVideo,
      ...currentVideo,
      scrapbookPurposes: ['production'],
    };
    expect(changed).toBe(true);
    expect(deleteScrapbookVideo).not.toHaveBeenCalled();
    expect(saveScrapbookVideos).toHaveBeenCalledWith([productionVideo]);
    expect(stateSetters[0]).toHaveBeenCalledWith([productionVideo]);
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.savedVideos, [productionVideo]);
  });

  it('stores a production-only source without adding it to the material scrapbook list', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [] });
    const scrapbook = useScrapbook();

    const result = await scrapbook.ensureProductionVideoSource(savedVideo);

    const productionVideo = { ...savedVideo, scrapbookPurposes: ['production'] };
    expect(result).toEqual({
      ready: true,
      createdProductionOnlySource: true,
    });
    expect(saveScrapbookVideos).toHaveBeenCalledWith([productionVideo]);
    expect(stateSetters[0]).toHaveBeenCalledWith([productionVideo]);
  });

  it('rolls back a source created only for a failed production candidate save', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [] });
    const scrapbook = useScrapbook();

    await scrapbook.ensureProductionVideoSource(savedVideo);
    const cleanedUp = await scrapbook.rollbackCreatedProductionVideoSource('video-1');

    expect(cleanedUp).toBe(true);
    expect(deleteScrapbookVideo).toHaveBeenCalledWith('video-1');
    expect(stateSetters[0]).toHaveBeenLastCalledWith([]);
    expect(writeJsonStorage).toHaveBeenLastCalledWith(STORAGE_KEYS.savedVideos, []);
    expect(stateSetters[2]).toHaveBeenLastCalledWith('');
  });

  it('never deletes a source that already has the material purpose', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [] });
    const scrapbook = useScrapbook();

    await scrapbook.toggleScrapVideo(savedVideo);
    const result = await scrapbook.ensureProductionVideoSource(savedVideo);
    const cleanedUp = await scrapbook.rollbackCreatedProductionVideoSource('video-1');

    expect(result).toEqual({
      ready: true,
      createdProductionOnlySource: false,
    });
    expect(cleanedUp).toBe(true);
    expect(deleteScrapbookVideo).not.toHaveBeenCalled();
  });

  it('keeps the cached source and shows a warning when automatic cleanup fails', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [] });
    deleteScrapbookVideoMock.mockResolvedValueOnce({
      success: false,
      error: 'delete failed',
    });
    const scrapbook = useScrapbook();

    await scrapbook.ensureProductionVideoSource(savedVideo);
    const cleanedUp = await scrapbook.rollbackCreatedProductionVideoSource('video-1');

    expect(cleanedUp).toBe(false);
    expect(stateSetters[1]).toHaveBeenCalledWith(false);
    expect(stateSetters[2]).toHaveBeenCalledWith(
      SCRAPBOOK_SYNC_WARNINGS.productionSourceCleanupFailed,
    );
    expect(stateSetters[0]).not.toHaveBeenCalledWith([]);
  });

  it('exposes production-only sources separately from material scrapbook videos', () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    const productionVideo = { ...savedVideo, scrapbookPurposes: ['production'] };
    setScrapbookState({ cloudReady: true, savedVideos: [productionVideo, secondVideo] });

    const scrapbook = useScrapbook();

    expect(scrapbook.savedVideos).toEqual([secondVideo]);
    expect(scrapbook.productionSourceVideos).toEqual([productionVideo, secondVideo]);
    expect(scrapbook.isVideoSaved('video-1')).toBe(false);
    expect(scrapbook.isVideoSaved('video-2')).toBe(true);
  });

  it('shows current collected metadata without writing it back automatically', () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    const productionVideo = {
      ...savedVideo,
      savedAt: '2026-07-01T00:00:00.000Z',
      scrapbookPurposes: ['production'],
      view_count: 10,
    };
    setScrapbookState({ cloudReady: true, savedVideos: [productionVideo] });

    const scrapbook = useScrapbook({
      collectedVideos: [{
        videoId: 'video-1',
        title: 'Current title',
        view_count: 25,
      }],
    });

    expect(scrapbook.productionSourceVideos).toEqual([{
      ...productionVideo,
      title: 'Current title',
      view_count: 25,
    }]);
    expect(saveScrapbookVideos).not.toHaveBeenCalled();
    expect(deleteScrapbookVideo).not.toHaveBeenCalled();
    expect(writeJsonStorage).not.toHaveBeenCalled();
  });

  it('marks Cloud as not ready and avoids cache updates when scrapbook save fails', async () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [] });
    saveScrapbookVideosMock.mockResolvedValueOnce({
      success: false,
      error: 'save failed',
    });
    const scrapbook = useScrapbook();

    const changed = await scrapbook.toggleScrapVideo(savedVideo);

    expect(changed).toBe(false);
    expect(stateSetters[1]).toHaveBeenCalledWith(false);
    expect(stateSetters[2]).toHaveBeenCalledWith(SCRAPBOOK_SYNC_WARNINGS.saveFailed);
    expect(stateSetters[0]).not.toHaveBeenCalled();
    expect(writeJsonStorage).not.toHaveBeenCalled();
  });

  it('uses the current savedVideos state to answer whether a video is saved', () => {
    fetchScrapbookMock.mockReturnValueOnce(new Promise(() => {}));
    setScrapbookState({ cloudReady: true, savedVideos: [savedVideo] });
    const scrapbook = useScrapbook();

    expect(scrapbook.isVideoSaved('video-1')).toBe(true);
    expect(scrapbook.isVideoSaved('missing')).toBe(false);
  });

  it('ignores the Cloud scrapbook load result after the hook cleanup runs', async () => {
    let resolveFetch;
    fetchScrapbookMock.mockReturnValueOnce(new Promise(resolve => {
      resolveFetch = resolve;
    }));

    useScrapbook();
    expect(useEffect).toHaveBeenCalledTimes(1);
    effectCleanups[0]();
    resolveFetch({
      success: true,
      videos: [savedVideo],
    });
    await flushPromises();

    expect(stateSetters[0]).not.toHaveBeenCalled();
    expect(stateSetters[1]).not.toHaveBeenCalled();
    expect(stateSetters[2]).not.toHaveBeenCalled();
    expect(writeJsonStorage).not.toHaveBeenCalled();
  });
});
