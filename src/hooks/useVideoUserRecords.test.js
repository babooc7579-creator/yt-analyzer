import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  clearVideoUserRecordsMock,
  effectCleanups,
  fetchVideoUserRecordsMock,
  readJsonStorageMock,
  saveVideoUserRecordMock,
  stateOverrides,
  stateSetters,
  writeJsonStorageMock,
} = vi.hoisted(() => ({
  clearVideoUserRecordsMock: vi.fn(),
  effectCleanups: [],
  fetchVideoUserRecordsMock: vi.fn(),
  readJsonStorageMock: vi.fn(),
  saveVideoUserRecordMock: vi.fn(),
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
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const stateValue = stateOverrides.length
      ? stateOverrides.shift()
      : (typeof initialValue === 'function' ? initialValue() : initialValue);

    return [stateValue, setter];
  }),
}));

vi.mock('../services/videoRecordsApi', () => ({
  clearVideoUserRecords: clearVideoUserRecordsMock,
  fetchVideoUserRecords: fetchVideoUserRecordsMock,
  saveVideoUserRecord: saveVideoUserRecordMock,
}));

vi.mock('../services/storage', () => ({
  STORAGE_KEYS: {
    videoUserRecords: 'yt_crm_video_user_records',
  },
  readJsonStorage: readJsonStorageMock,
  writeJsonStorage: writeJsonStorageMock,
}));

import { useEffect, useRef, useState } from 'react';
import { VIDEO_STATUS } from '../constants/status';
import { VIDEO_RECORDS_SYNC_WARNINGS } from '../constants/syncWarnings';
import { STORAGE_KEYS, readJsonStorage, writeJsonStorage } from '../services/storage';
import {
  clearVideoUserRecords,
  fetchVideoUserRecords,
  saveVideoUserRecord,
} from '../services/videoRecordsApi';
import { useVideoUserRecords } from './useVideoUserRecords';

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const setVideoUserRecordsState = (records = {}) => {
  stateOverrides.push(records);
};

describe('useVideoUserRecords', () => {
  beforeEach(() => {
    effectCleanups.length = 0;
    stateOverrides.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();
    vi.unstubAllGlobals();

    fetchVideoUserRecordsMock.mockReset();
    saveVideoUserRecordMock.mockReset();
    clearVideoUserRecordsMock.mockReset();
    readJsonStorageMock.mockReset();
    writeJsonStorageMock.mockReset();

    fetchVideoUserRecordsMock.mockResolvedValue({
      success: true,
      records: {},
    });
    saveVideoUserRecordMock.mockImplementation(record => Promise.resolve({
      success: true,
      record,
    }));
    clearVideoUserRecordsMock.mockResolvedValue({ success: true });
    readJsonStorageMock.mockReturnValue({});
    writeJsonStorageMock.mockReturnValue(true);
  });

  it('uses Cloud records as the source of truth when Cloud load succeeds', async () => {
    fetchVideoUserRecordsMock.mockResolvedValueOnce({
      success: true,
      records: {
        v1: {
          status: VIDEO_STATUS.REVIEWED,
        },
      },
    });

    useVideoUserRecords();
    await flushPromises();

    expect(useRef).toHaveBeenCalledWith({});
    expect(useState).toHaveBeenNthCalledWith(1, {});
    expect(fetchVideoUserRecords).toHaveBeenCalledTimes(1);
    expect(readJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledWith({
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.REVIEWED,
        statusIds: [VIDEO_STATUS.REVIEWED],
      },
    });
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.videoUserRecords, {
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.REVIEWED,
        statusIds: [VIDEO_STATUS.REVIEWED],
      },
    });
    expect(stateSetters[1]).toHaveBeenCalledWith('');
  });

  it('does not replace an empty successful Cloud response with localStorage records', async () => {
    fetchVideoUserRecordsMock.mockResolvedValueOnce({
      success: true,
      records: {},
    });
    readJsonStorageMock.mockReturnValueOnce({
      v1: {
        status: VIDEO_STATUS.PRODUCTION_CANDIDATE,
      },
    });

    useVideoUserRecords();
    await flushPromises();

    expect(readJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledWith({});
    expect(writeJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.videoUserRecords, {});
    expect(stateSetters[1]).toHaveBeenCalledWith('');
  });

  it('falls back to localStorage only when Cloud load fails', async () => {
    fetchVideoUserRecordsMock.mockRejectedValueOnce(new Error('network failed'));
    readJsonStorageMock.mockReturnValueOnce({
      v2: {
        status: VIDEO_STATUS.TITLE_REFERENCE,
        statusIds: [VIDEO_STATUS.TITLE_REFERENCE],
      },
    });

    useVideoUserRecords();
    await flushPromises();

    expect(readJsonStorage).toHaveBeenCalledWith(STORAGE_KEYS.videoUserRecords, {});
    expect(stateSetters[0]).toHaveBeenCalledWith({
      v2: {
        videoId: 'v2',
        status: VIDEO_STATUS.TITLE_REFERENCE,
        statusIds: [VIDEO_STATUS.TITLE_REFERENCE],
      },
    });
    expect(stateSetters[1]).toHaveBeenCalledWith(VIDEO_RECORDS_SYNC_WARNINGS.loadFallback);
    expect(writeJsonStorage).not.toHaveBeenCalled();
  });

  it('saves statusIds to Cloud and refreshes localStorage only after Cloud save succeeds', async () => {
    setVideoUserRecordsState({
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.WATCH_LATER,
        statusIds: [VIDEO_STATUS.WATCH_LATER],
      },
    });
    const recordsHook = useVideoUserRecords();
    await flushPromises();

    const saved = await recordsHook.markVideoStatus(
      'v1',
      VIDEO_STATUS.PRODUCTION_CANDIDATE,
      { memo: 'strong candidate' },
    );

    expect(saved).toBe(true);
    expect(saveVideoUserRecord).toHaveBeenCalledWith(expect.objectContaining({
      videoId: 'v1',
      status: VIDEO_STATUS.PRODUCTION_CANDIDATE,
      statusIds: [
        VIDEO_STATUS.WATCH_LATER,
        VIDEO_STATUS.PRODUCTION_CANDIDATE,
      ],
      memo: 'strong candidate',
    }));
    expect(stateSetters[0]).toHaveBeenNthCalledWith(2, expect.any(Function));
    expect(stateSetters[0]).toHaveBeenNthCalledWith(3, expect.any(Function));

    const optimisticUpdate = stateSetters[0].mock.calls[1][0];
    const cloudUpdate = stateSetters[0].mock.calls[2][0];
    const previousState = {
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.WATCH_LATER,
        statusIds: [VIDEO_STATUS.WATCH_LATER],
      },
    };

    expect(optimisticUpdate(previousState).v1).toMatchObject({
      status: VIDEO_STATUS.PRODUCTION_CANDIDATE,
      memo: 'strong candidate',
    });
    expect(cloudUpdate(previousState).v1.statusIds).toEqual([
      VIDEO_STATUS.WATCH_LATER,
      VIDEO_STATUS.PRODUCTION_CANDIDATE,
    ]);
    expect(writeJsonStorage).toHaveBeenLastCalledWith(STORAGE_KEYS.videoUserRecords, {
      v1: expect.objectContaining({
        status: VIDEO_STATUS.PRODUCTION_CANDIDATE,
        statusIds: [
          VIDEO_STATUS.WATCH_LATER,
          VIDEO_STATUS.PRODUCTION_CANDIDATE,
        ],
      }),
    });
    expect(stateSetters[1]).toHaveBeenLastCalledWith('');
  });

  it('restores the previous record and does not update localStorage when Cloud save fails', async () => {
    const previousRecord = {
      videoId: 'v1',
      status: VIDEO_STATUS.REVIEWED,
      statusIds: [VIDEO_STATUS.REVIEWED],
    };
    setVideoUserRecordsState({ v1: previousRecord });
    saveVideoUserRecordMock.mockResolvedValueOnce({
      success: false,
      error: 'save failed',
    });
    const recordsHook = useVideoUserRecords();
    await flushPromises();
    writeJsonStorageMock.mockClear();

    const saved = await recordsHook.updateVideoUserRecord('v1', {
      statusIds: [VIDEO_STATUS.REVIEWED, VIDEO_STATUS.REFERENCE_MATERIAL],
    });

    expect(saved).toBe(false);
    expect(writeJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenNthCalledWith(2, expect.any(Function));
    expect(stateSetters[0]).toHaveBeenNthCalledWith(3, expect.any(Function));

    const restoreUpdate = stateSetters[0].mock.calls[2][0];
    expect(restoreUpdate({
      v1: {
        videoId: 'v1',
        statusIds: [VIDEO_STATUS.REVIEWED, VIDEO_STATUS.REFERENCE_MATERIAL],
      },
      v2: {
        videoId: 'v2',
        status: VIDEO_STATUS.EXCLUDED,
      },
    })).toEqual({
      v1: previousRecord,
      v2: {
        videoId: 'v2',
        status: VIDEO_STATUS.EXCLUDED,
      },
    });
    expect(stateSetters[1]).toHaveBeenLastCalledWith(VIDEO_RECORDS_SYNC_WARNINGS.saveFailed);
  });

  it('clears Cloud records only after confirmation and keeps previous records when Cloud clear fails', async () => {
    const previousRecords = {
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.EXCLUDED,
        statusIds: [VIDEO_STATUS.EXCLUDED],
      },
    };
    setVideoUserRecordsState(previousRecords);
    vi.stubGlobal('window', { confirm: vi.fn(() => true) });
    clearVideoUserRecordsMock.mockResolvedValueOnce({
      success: false,
      error: 'clear failed',
    });
    const recordsHook = useVideoUserRecords();
    await flushPromises();
    writeJsonStorageMock.mockClear();

    const cleared = await recordsHook.clearRadarDecisions();

    expect(cleared).toBe(false);
    expect(window.confirm).toHaveBeenCalledTimes(1);
    expect(clearVideoUserRecords).toHaveBeenCalledTimes(1);
    expect(stateSetters[0]).toHaveBeenNthCalledWith(2, {});
    expect(stateSetters[0]).toHaveBeenNthCalledWith(3, previousRecords);
    expect(writeJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[1]).toHaveBeenLastCalledWith(VIDEO_RECORDS_SYNC_WARNINGS.clearFailed);
  });

  it('does not clear records when the confirmation is cancelled', async () => {
    setVideoUserRecordsState({
      v1: {
        videoId: 'v1',
        status: VIDEO_STATUS.EXCLUDED,
      },
    });
    vi.stubGlobal('window', { confirm: vi.fn(() => false) });
    const recordsHook = useVideoUserRecords();
    await flushPromises();
    writeJsonStorageMock.mockClear();

    const cleared = await recordsHook.clearRadarDecisions();

    expect(cleared).toBe(false);
    expect(clearVideoUserRecords).not.toHaveBeenCalled();
    expect(writeJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledTimes(1);
  });

  it('ignores the Cloud load result after the hook cleanup runs', async () => {
    let resolveFetch;
    fetchVideoUserRecordsMock.mockReturnValueOnce(new Promise(resolve => {
      resolveFetch = resolve;
    }));

    useVideoUserRecords();
    expect(useEffect).toHaveBeenCalledTimes(1);
    effectCleanups[0]();
    resolveFetch({
      success: true,
      records: {
        v1: {
          status: VIDEO_STATUS.REVIEWED,
        },
      },
    });
    await flushPromises();

    expect(stateSetters[0]).not.toHaveBeenCalled();
    expect(writeJsonStorage).not.toHaveBeenCalled();
    expect(stateSetters[1]).not.toHaveBeenCalled();
  });
});
