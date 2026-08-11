import { beforeEach, describe, expect, it, vi } from 'vitest';

const { stateSetters } = vi.hoisted(() => ({
  stateSetters: [],
}));

vi.mock('react', () => ({
  useRef: vi.fn((initialValue) => ({ current: initialValue })),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);
    return [initialValue, setter];
  }),
}));

import { useRef, useState } from 'react';
import { useAppRuntimeState } from './useAppRuntimeState';

describe('useAppRuntimeState', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    vi.clearAllMocks();
  });

  it('initializes app runtime state with safe local defaults', () => {
    const runtimeState = useAppRuntimeState();

    expect(useState).toHaveBeenNthCalledWith(1, '');
    expect(useState).toHaveBeenNthCalledWith(2, null);
    expect(useState).toHaveBeenNthCalledWith(3, false);
    expect(useState).toHaveBeenNthCalledWith(4, null);
    expect(useState).toHaveBeenNthCalledWith(5, []);
    expect(useState).toHaveBeenNthCalledWith(6, false);
    expect(useState).toHaveBeenNthCalledWith(7, '');
    expect(useState).toHaveBeenNthCalledWith(8, '');
    expect(useState).toHaveBeenNthCalledWith(9, null);
    expect(runtimeState).toMatchObject({
      apiKey: '',
      error: '',
      isScanning: false,
      loading: false,
      progressMsg: '',
      scanningTag: null,
      storedVideoLoadResult: null,
      updatingChannelId: null,
      videos: [],
    });
    expect(useRef).toHaveBeenCalledWith({
      activeRequestId: null,
      requestId: 0,
      selectionKey: '',
    });
    expect(runtimeState.storedVideoLoadRequestRef.current).toEqual({
      activeRequestId: null,
      requestId: 0,
      selectionKey: '',
    });
  });

  it('exposes setters for the local runtime state without changing API behavior', () => {
    const runtimeState = useAppRuntimeState();

    expect(runtimeState.setApiKey).toBe(stateSetters[0]);
    expect(runtimeState.setUpdatingChannelId).toBe(stateSetters[1]);
    expect(runtimeState.setIsScanning).toBe(stateSetters[2]);
    expect(runtimeState.setScanningTag).toBe(stateSetters[3]);
    expect(runtimeState.setVideos).toBe(stateSetters[4]);
    expect(runtimeState.setLoading).toBe(stateSetters[5]);
    expect(runtimeState.setProgressMsg).toBe(stateSetters[6]);
    expect(runtimeState.setError).toBe(stateSetters[7]);
    expect(runtimeState.setStoredVideoLoadResult).toBe(stateSetters[8]);
  });
});
