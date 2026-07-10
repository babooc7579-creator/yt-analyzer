import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  stateOverrides,
  stateSetters,
} = vi.hoisted(() => ({
  stateOverrides: [],
  stateSetters: [],
}));

vi.mock('react', () => ({
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const stateValue = stateOverrides.length
      ? stateOverrides.shift()
      : (typeof initialValue === 'function' ? initialValue() : initialValue);

    return [stateValue, setter];
  }),
}));

import { useState } from 'react';
import { useChannelNotesModal } from './useChannelNotesModal';

const channel = {
  id: 'channel-1',
  category: '해외',
  title: 'Known Channel',
};

const updatedChannel = {
  ...channel,
  notes: [{ text: 'check this later' }],
};

const createDeps = (overrides = {}) => ({
  onError: vi.fn(),
  saveChannelNote: vi.fn(() => Promise.resolve(updatedChannel)),
  ...overrides,
});

const setInitialNotesModal = (notesModal) => {
  stateOverrides.push(notesModal);
};

describe('useChannelNotesModal', () => {
  beforeEach(() => {
    stateOverrides.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();
  });

  it('starts closed and exposes modal actions', () => {
    const notesHook = useChannelNotesModal(createDeps());

    expect(useState).toHaveBeenCalledWith({
      channel: null,
      isOpen: false,
      newNoteText: '',
      saving: false,
    });
    expect(notesHook.notesModal).toEqual({
      channel: null,
      isOpen: false,
      newNoteText: '',
      saving: false,
    });
    expect(notesHook).toEqual(expect.objectContaining({
      addChannelNote: expect.any(Function),
      changeNoteText: expect.any(Function),
      closeNotesModal: expect.any(Function),
      openNotesModal: expect.any(Function),
    }));
  });

  it('opens and closes the channel notes modal with a clean input state', () => {
    const notesHook = useChannelNotesModal(createDeps());

    notesHook.openNotesModal(channel);
    notesHook.closeNotesModal();

    expect(stateSetters[0]).toHaveBeenNthCalledWith(1, {
      isOpen: true,
      channel,
      newNoteText: '',
      saving: false,
    });
    expect(stateSetters[0]).toHaveBeenNthCalledWith(2, {
      channel: null,
      isOpen: false,
      newNoteText: '',
      saving: false,
    });
  });

  it('updates note text without changing the rest of the modal state', () => {
    const notesHook = useChannelNotesModal(createDeps());

    notesHook.changeNoteText('new memo');

    const updater = stateSetters[0].mock.calls[0][0];
    expect(updater({
      channel,
      isOpen: true,
      newNoteText: '',
      saving: false,
    })).toEqual({
      channel,
      isOpen: true,
      newNoteText: 'new memo',
      saving: false,
    });
  });

  it('does not save when note text is blank or no channel is selected', async () => {
    const blankDeps = createDeps();
    setInitialNotesModal({
      channel,
      isOpen: true,
      newNoteText: '   ',
      saving: false,
    });
    await useChannelNotesModal(blankDeps).addChannelNote();

    const noChannelDeps = createDeps();
    setInitialNotesModal({
      channel: null,
      isOpen: true,
      newNoteText: 'memo',
      saving: false,
    });
    await useChannelNotesModal(noChannelDeps).addChannelNote();

    expect(blankDeps.saveChannelNote).not.toHaveBeenCalled();
    expect(noChannelDeps.saveChannelNote).not.toHaveBeenCalled();
  });

  it('saves a channel note through Cloud and keeps the modal open with a clean input', async () => {
    const deps = createDeps();
    setInitialNotesModal({
      channel,
      isOpen: true,
      newNoteText: '  check this later  ',
      saving: false,
    });

    await useChannelNotesModal(deps).addChannelNote();

    expect(stateSetters[0]).toHaveBeenNthCalledWith(1, expect.any(Function));
    expect(stateSetters[0].mock.calls[0][0]({
      channel,
      isOpen: true,
      newNoteText: 'check this later',
      saving: false,
    })).toEqual({
      channel,
      isOpen: true,
      newNoteText: 'check this later',
      saving: true,
    });
    expect(deps.saveChannelNote).toHaveBeenCalledWith({
      id: channel.id,
      category: channel.category,
      text: 'check this later',
    });
    expect(stateSetters[0]).toHaveBeenLastCalledWith({
      isOpen: true,
      channel: updatedChannel,
      newNoteText: '',
      saving: false,
    });
  });

  it('reports note save failures and turns off the saving state', async () => {
    const deps = createDeps({
      saveChannelNote: vi.fn(() => Promise.reject(new Error('Cloud note failed'))),
    });
    setInitialNotesModal({
      channel,
      isOpen: true,
      newNoteText: 'memo',
      saving: false,
    });

    await useChannelNotesModal(deps).addChannelNote();

    expect(deps.onError).toHaveBeenCalledWith('Cloud note failed');
    expect(stateSetters[0]).toHaveBeenLastCalledWith(expect.any(Function));
    const updater = stateSetters[0].mock.calls.at(-1)[0];
    expect(updater({
      channel,
      isOpen: true,
      newNoteText: 'memo',
      saving: true,
    })).toEqual({
      channel,
      isOpen: true,
      newNoteText: 'memo',
      saving: false,
    });
  });
});
