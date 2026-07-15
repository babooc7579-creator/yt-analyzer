import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  fetchChannelsMock,
  stateOverrides,
  stateSetters,
} = vi.hoisted(() => ({
  fetchChannelsMock: vi.fn(),
  stateOverrides: [],
  stateSetters: [],
}));

vi.mock('react', () => ({
  useCallback: vi.fn((callback) => callback),
  useEffect: vi.fn((effect) => {
    const cleanup = effect();
    return cleanup;
  }),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const stateValue = stateOverrides.length
      ? stateOverrides.shift()
      : (typeof initialValue === 'function' ? initialValue() : initialValue);

    return [stateValue, setter];
  }),
}));

vi.mock('../services/channelApi', () => ({
  fetchChannels: fetchChannelsMock,
}));

import { useCallback, useEffect, useState } from 'react';
import { fetchChannels } from '../services/channelApi';
import { CHANNEL_LOAD_FAILED_MESSAGE } from '../utils/channelActions';
import { useCloudChannels } from './useCloudChannels';

const channelA = {
  id: 'channel-a',
  title: 'Channel A',
  grade: 'S',
  status: 'active',
};

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const setCloudChannelsState = ({
  channels = [],
  loading = true,
} = {}) => {
  stateOverrides.push(channels, loading);
};

describe('useCloudChannels', () => {
  beforeEach(() => {
    stateOverrides.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();

    fetchChannelsMock.mockReset();
    fetchChannelsMock.mockResolvedValue({
      success: true,
      channels: [],
    });
  });

  it('loads Cloud channels on mount and exposes the channel state setter', async () => {
    fetchChannelsMock.mockResolvedValueOnce({
      success: true,
      channels: [channelA],
    });
    const onError = vi.fn();

    const channelsHook = useCloudChannels({ onError });
    await flushPromises();

    expect(useState).toHaveBeenNthCalledWith(1, []);
    expect(useState).toHaveBeenNthCalledWith(2, true);
    expect(useCallback).toHaveBeenCalledWith(expect.any(Function), [onError]);
    expect(useEffect).toHaveBeenCalledTimes(1);
    expect(channelsHook.savedChannels).toEqual([]);
    expect(channelsHook.setSavedChannels).toBe(stateSetters[0]);
    expect(channelsHook.channelsLoading).toBe(true);
    expect(fetchChannels).toHaveBeenCalledTimes(1);
    expect(stateSetters[1]).toHaveBeenNthCalledWith(1, true);
    expect(stateSetters[0]).toHaveBeenCalledWith([channelA]);
    expect(stateSetters[1]).toHaveBeenLastCalledWith(false);
    expect(onError).not.toHaveBeenCalled();
  });

  it('uses an empty list when Cloud channels response omits channels', async () => {
    fetchChannelsMock.mockResolvedValueOnce({
      success: true,
    });

    useCloudChannels({ onError: vi.fn() });
    await flushPromises();

    expect(stateSetters[0]).toHaveBeenCalledWith([]);
    expect(stateSetters[1]).toHaveBeenLastCalledWith(false);
  });

  it('reports Cloud channel load failures without replacing current channel state', async () => {
    fetchChannelsMock.mockResolvedValueOnce({
      success: false,
      error: 'Cloud channels unavailable',
    });
    const onError = vi.fn();

    useCloudChannels({ onError });
    await flushPromises();

    expect(onError).toHaveBeenCalledWith(
      'Cloud channels unavailable Cloud 채널 목록 조회를 완료하지 못했습니다. 조회가 성공할 때까지 화면의 채널 목록을 기준 데이터로 보지 않습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(stateSetters[0]).not.toHaveBeenCalled();
    expect(stateSetters[1]).toHaveBeenLastCalledWith(false);
  });

  it('uses the centralized fallback message when Cloud channel load fails without an error message', async () => {
    fetchChannelsMock.mockResolvedValueOnce({
      success: false,
      error: '',
    });
    const onError = vi.fn();

    useCloudChannels({ onError });
    await flushPromises();

    expect(onError).toHaveBeenCalledWith(
      `${CHANNEL_LOAD_FAILED_MESSAGE} Cloud 채널 목록 조회를 완료하지 못했습니다. 조회가 성공할 때까지 화면의 채널 목록을 기준 데이터로 보지 않습니다. 연결을 확인한 뒤 다시 시도해 주세요.`,
    );
  });

  it('allows manual reloads through the returned load function', async () => {
    fetchChannelsMock.mockReturnValueOnce(new Promise(() => {}));
    fetchChannelsMock.mockResolvedValueOnce({
      success: true,
      channels: [channelA],
    });
    setCloudChannelsState({
      channels: [],
      loading: false,
    });
    const channelsHook = useCloudChannels({ onError: vi.fn() });

    const result = await channelsHook.loadChannelsFromCloud();

    expect(fetchChannels).toHaveBeenCalledTimes(2);
    expect(stateSetters[1]).toHaveBeenNthCalledWith(1, true);
    expect(stateSetters[0]).toHaveBeenCalledWith([channelA]);
    expect(stateSetters[1]).toHaveBeenLastCalledWith(false);
    expect(result).toEqual({ success: true, channels: [channelA] });
  });

  it('returns a failure result so settings can explain a manual reload failure', async () => {
    fetchChannelsMock.mockResolvedValueOnce({ success: false, error: 'Cloud unavailable' });
    const channelsHook = useCloudChannels({ onError: vi.fn() });
    await flushPromises();

    fetchChannelsMock.mockResolvedValueOnce({ success: false, error: 'Cloud unavailable again' });
    const result = await channelsHook.loadChannelsFromCloud();

    expect(result).toMatchObject({ success: false });
    expect(result.error).toContain('Cloud unavailable again');
  });
});
