import { beforeEach, describe, expect, it, vi } from 'vitest';

const { stateSetters } = vi.hoisted(() => ({
  stateSetters: [],
}));

vi.mock('react', () => ({
  useMemo: vi.fn((factory) => factory()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);
    return [initialValue, setter];
  }),
}));

vi.mock('../utils/video', () => ({
  filterAndSortVideos: vi.fn(() => [{ videoId: 'filtered-video' }]),
}));

import { useMemo, useState } from 'react';
import { filterAndSortVideos } from '../utils/video';
import { useVideoExplorerState } from './useVideoExplorerState';

describe('useVideoExplorerState', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    vi.clearAllMocks();
  });

  it('initializes video explorer filters with the expected safe defaults', () => {
    const videos = [{ videoId: 'video-1', title: 'Clip' }];

    const explorerState = useVideoExplorerState(videos);

    expect(useState).toHaveBeenNthCalledWith(1, '');
    expect(useState).toHaveBeenNthCalledWith(2, 0);
    expect(useState).toHaveBeenNthCalledWith(3, 'all');
    expect(useState).toHaveBeenNthCalledWith(4, false);
    expect(useState).toHaveBeenNthCalledWith(5, 'multiplier');
    expect(useState).toHaveBeenNthCalledWith(6, 'card');
    expect(explorerState.searchKeyword).toBe('');
    expect(explorerState.viewFilter).toBe(0);
    expect(explorerState.lengthFilter).toBe('all');
    expect(explorerState.ttoTtoMode).toBe(false);
    expect(explorerState.sortType).toBe('multiplier');
    expect(explorerState.viewMode).toBe('card');
  });

  it('passes the default filter state to the video filter model', () => {
    const videos = [{ videoId: 'video-1', title: 'Clip' }];

    const explorerState = useVideoExplorerState(videos);

    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [
      videos,
      '',
      0,
      'all',
      false,
      'multiplier',
    ]);
    expect(filterAndSortVideos).toHaveBeenCalledWith({
      videos,
      searchKeyword: '',
      viewFilter: 0,
      lengthFilter: 'all',
      ttoTtoMode: false,
      sortType: 'multiplier',
    });
    expect(explorerState.filteredAndSortedVideos).toEqual([{ videoId: 'filtered-video' }]);
  });

  it('exposes setters for all visible video explorer controls', () => {
    const explorerState = useVideoExplorerState([]);

    expect(explorerState.setSearchKeyword).toBe(stateSetters[0]);
    expect(explorerState.setViewFilter).toBe(stateSetters[1]);
    expect(explorerState.setLengthFilter).toBe(stateSetters[2]);
    expect(explorerState.setTtoTtoMode).toBe(stateSetters[3]);
    expect(explorerState.setSortType).toBe(stateSetters[4]);
    expect(explorerState.setViewMode).toBe(stateSetters[5]);
  });
});
