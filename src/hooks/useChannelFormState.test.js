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
import { useChannelFormState } from './useChannelFormState';

const getChannelFormSetters = () => ({
  setAddMode: stateSetters[8],
  setBulkInput: stateSetters[9],
  setBulkResult: stateSetters[11],
  setChannelPreview: stateSetters[6],
  setNewChannelInput: stateSetters[2],
  setNewChannelNote: stateSetters[5],
  setNewChannelTags: stateSetters[3],
  setRenameValue: stateSetters[13],
  setRenamingCategory: stateSetters[12],
});

describe('useChannelFormState', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    vi.clearAllMocks();
  });

  it('initializes the channel add form state with safe defaults', () => {
    const formState = useChannelFormState();

    expect(useState).toHaveBeenCalledTimes(15);
    expect(formState.newChannelInput).toBe('');
    expect(formState.newChannelTags).toEqual([]);
    expect(formState.newChannelLang).toBe('EN');
    expect(formState.channelPreview).toBeNull();
    expect(formState.addMode).toBe('single');
    expect(formState.bulkResult).toBeNull();
    expect(formState.renamingCategory).toBeNull();
  });

  it('clears channel preview editing state without touching Cloud data', () => {
    const formState = useChannelFormState();
    const setters = getChannelFormSetters();

    formState.cancelChannelPreview();

    expect(setters.setChannelPreview).toHaveBeenCalledWith(null);
    expect(setters.setNewChannelInput).toHaveBeenCalledWith('');
    expect(setters.setNewChannelTags).toHaveBeenCalledWith([]);
    expect(setters.setNewChannelNote).toHaveBeenCalledWith('');
  });

  it('resets bulk add state back to the single add flow', () => {
    const formState = useChannelFormState();
    const setters = getChannelFormSetters();

    formState.resetBulkAdd();

    expect(setters.setBulkInput).toHaveBeenCalledWith('');
    expect(setters.setBulkResult).toHaveBeenCalledWith(null);
    expect(setters.setAddMode).toHaveBeenCalledWith('single');
    expect(setters.setNewChannelTags).toHaveBeenCalledWith([]);
  });

  it('toggles new channel tags through the tag state updater', () => {
    const formState = useChannelFormState();
    const setters = getChannelFormSetters();

    formState.toggleNewChannelTag('history');

    expect(setters.setNewChannelTags).toHaveBeenCalledWith(expect.any(Function));

    const updater = setters.setNewChannelTags.mock.calls[0][0];
    expect(updater([])).toEqual(['history']);
    expect(updater(['history', 'movie'])).toEqual(['movie']);
  });

  it('starts and cancels category rename state locally', () => {
    const formState = useChannelFormState();
    const setters = getChannelFormSetters();

    formState.startRenameCategory('history');
    expect(setters.setRenamingCategory).toHaveBeenCalledWith('history');
    expect(setters.setRenameValue).toHaveBeenCalledWith('history');

    formState.cancelRenameCategory();
    expect(setters.setRenamingCategory).toHaveBeenLastCalledWith(null);
    expect(setters.setRenameValue).toHaveBeenLastCalledWith('');
  });
});
