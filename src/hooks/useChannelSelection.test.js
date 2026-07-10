import { beforeEach, describe, expect, it, vi } from 'vitest';

const { stateSetters } = vi.hoisted(() => ({
  stateSetters: [],
}));

vi.mock('react', () => ({
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);
    return [initialValue, setter];
  }),
}));

import { useState } from 'react';
import { useChannelSelection } from './useChannelSelection';

describe('useChannelSelection', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    vi.clearAllMocks();
  });

  it('initializes the selected category tab and empty channel selection', () => {
    const selection = useChannelSelection('shorts');

    expect(useState).toHaveBeenNthCalledWith(1, 'shorts');
    expect(useState).toHaveBeenNthCalledWith(2, []);
    expect(selection.selectedCategoryTab).toBe('shorts');
    expect(selection.selectedChannelIds).toEqual([]);
    expect(selection.setSelectedCategoryTab).toBe(stateSetters[0]);
    expect(selection.setSelectedChannelIds).toBe(stateSetters[1]);
  });

  it('toggles channel selection through the selected channel state updater', () => {
    const { toggleChannelSelection } = useChannelSelection('shorts');

    toggleChannelSelection('channel-1');

    expect(stateSetters[1]).toHaveBeenCalledWith(expect.any(Function));

    const updater = stateSetters[1].mock.calls[0][0];
    expect(updater([])).toEqual(['channel-1']);
    expect(updater(['channel-1', 'channel-2'])).toEqual(['channel-2']);
  });
});
