import { beforeEach, describe, expect, it, vi } from 'vitest';

const { stateSetters, stateValueOverrides } = vi.hoisted(() => ({
  stateSetters: [],
  stateValueOverrides: [],
}));

vi.mock('react', () => ({
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const value = stateValueOverrides.length
      ? stateValueOverrides.shift()
      : initialValue;

    return [value, setter];
  }),
}));

import { useState } from 'react';
import { useCreatorWorkspaceNavigation } from './useCreatorWorkspaceNavigation';

const setStateValues = (...values) => {
  stateValueOverrides.push(...values);
};

describe('useCreatorWorkspaceNavigation', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    stateValueOverrides.length = 0;
    vi.clearAllMocks();
  });

  it('starts on the Creator OS home view with the dashboard tab and work panel closed', () => {
    const navigation = useCreatorWorkspaceNavigation();

    expect(useState).toHaveBeenNthCalledWith(1, 'dashboard');
    expect(useState).toHaveBeenNthCalledWith(2, false);
    expect(useState).toHaveBeenNthCalledWith(3, 'home');
    expect(useState).toHaveBeenNthCalledWith(4, null);
    expect(navigation).toMatchObject({
      activeTab: 'dashboard',
      creatorView: 'home',
      creatorViewIntent: null,
      isHomeView: true,
      isLegacyWorkspaceView: false,
      showWorkPanel: false,
    });
    expect(navigation.activeCreatorItem.id).toBe('home');
  });

  it('opens channel workspaces on the dashboard and shows the work panel', () => {
    const navigation = useCreatorWorkspaceNavigation();

    navigation.openCreatorView({ id: 'ops-add-channel' });

    expect(stateSetters[2]).toHaveBeenCalledWith('ops-add-channel');
    expect(stateSetters[0]).toHaveBeenCalledWith('dashboard');
    expect(stateSetters[1]).toHaveBeenCalledWith(true);
    expect(stateSetters[3]).toHaveBeenCalledWith(null);
  });

  it('opens production workspaces on the scrapbook tab without the legacy work panel', () => {
    setStateValues('dashboard', true, 'ops-channel-list');
    const navigation = useCreatorWorkspaceNavigation();

    navigation.openCreatorView({ id: 'studio-candidates' });

    expect(stateSetters[2]).toHaveBeenCalledWith('studio-candidates');
    expect(stateSetters[0]).toHaveBeenCalledWith('scrapbook');
    expect(stateSetters[1]).toHaveBeenCalledWith(false);
    expect(stateSetters[3]).toHaveBeenCalledWith(null);
  });

  it('forwards a one-time view intent when opening a specific production candidate', () => {
    const navigation = useCreatorWorkspaceNavigation();
    const intent = { searchQuery: '예약 영상', source: 'upload-calendar' };

    navigation.openCreatorView({ id: 'studio-candidates', intent });

    expect(stateSetters[3]).toHaveBeenCalledWith(intent);
  });

  it('keeps passive views from changing the current tab or work panel state', () => {
    setStateValues('scrapbook', true, 'vault-all');
    const navigation = useCreatorWorkspaceNavigation();

    navigation.openCreatorView({ id: 'home' });

    expect(stateSetters[2]).toHaveBeenCalledWith('home');
    expect(stateSetters[0]).toHaveBeenCalledWith('scrapbook');
    expect(stateSetters[1]).toHaveBeenCalledWith(true);
  });
});
