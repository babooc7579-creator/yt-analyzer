import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  stateOverrides,
  stateSetters,
} = vi.hoisted(() => ({
  stateOverrides: [],
  stateSetters: [],
}));

vi.mock('react', () => ({
  useEffect: vi.fn((effect) => effect()),
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

import { useEffect, useRef, useState } from 'react';
import { useProductionKanbanActions } from './useProductionKanbanActions';

const videoUserRecords = {
  video1: {
    videoId: 'video1',
    draftTitle: 'Saved title',
    note: 'Saved note',
    targetPublishDate: '2026-07-20',
  },
};

const createDeps = (overrides = {}) => ({
  onMoveVideo: vi.fn(() => Promise.resolve(true)),
  onUpdateDiscoveryLink: vi.fn(() => Promise.resolve(true)),
  onUpdateVideoRecord: vi.fn(() => Promise.resolve(true)),
  videoUserRecords,
  ...overrides,
});

const setKanbanState = ({
  draftRecords = {},
  saveStates = {},
  moveStates = {},
  linkMoveStates = {},
} = {}) => {
  stateOverrides.push(draftRecords, saveStates, moveStates, linkMoveStates);
};

const runStateUpdater = (setter, currentValue, callIndex = 0) => {
  const updater = setter.mock.calls[callIndex][0];
  return updater(currentValue);
};

describe('useProductionKanbanActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stateOverrides.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('syncs draft records from Cloud video user records on mount', () => {
    const kanbanActions = useProductionKanbanActions(createDeps());

    expect(useState).toHaveBeenCalledTimes(4);
    expect(useEffect).toHaveBeenCalledWith(expect.any(Function), [videoUserRecords]);
    expect(stateSetters[0]).toHaveBeenCalledWith(videoUserRecords);
    expect(kanbanActions.draftRecords).toEqual({});
    expect(kanbanActions.saveStates).toEqual({});
    expect(kanbanActions.moveStates).toEqual({});
    expect(kanbanActions.linkMoveStates).toEqual({});
  });

  it('keeps an in-progress draft when an equivalent Cloud record map gets a new object identity', () => {
    useRef
      .mockImplementationOnce((initialValue) => ({ current: initialValue }))
      .mockImplementationOnce(() => ({ current: JSON.stringify(videoUserRecords) }));

    useProductionKanbanActions(createDeps({
      videoUserRecords: {
        video1: { ...videoUserRecords.video1 },
      },
    }));

    expect(stateSetters[0]).not.toHaveBeenCalled();
  });

  it('updates a draft record using the current draft or saved Cloud record as the base', () => {
    const kanbanActions = useProductionKanbanActions(createDeps());

    kanbanActions.updateDraftRecord('video1', { draftTitle: 'New draft' });

    expect(runStateUpdater(stateSetters[0], {}, 1)).toEqual({
      video1: {
        videoId: 'video1',
        draftTitle: 'New draft',
        note: 'Saved note',
        targetPublishDate: '2026-07-20',
      },
    });
  });

  it('detects unsaved production draft changes from the current draft state', () => {
    setKanbanState({
      draftRecords: {
        video1: {
          ...videoUserRecords.video1,
          note: 'Changed note',
        },
        video2: {
          videoId: 'video2',
          draftTitle: '',
          note: '',
          targetPublishDate: '',
        },
      },
    });

    const kanbanActions = useProductionKanbanActions(createDeps());

    expect(kanbanActions.hasUnsavedChanges('video1')).toBe(true);
    expect(kanbanActions.hasUnsavedChanges('video2')).toBe(false);
    expect(kanbanActions.hasUnsavedChanges('missing')).toBe(false);
  });

  it('saves production draft fields and clears the temporary saved state after success', async () => {
    setKanbanState({
      draftRecords: {
        video1: {
          videoId: 'video1',
          draftTitle: 'Draft title',
          note: 'Draft note',
          scriptAnalysis: 'Draft analysis',
          scriptBody: 'Draft body',
          scriptOutline: 'Draft outline',
          scriptStatus: 'revision',
          targetPublishDate: '2026-07-21',
          ignored: 'not sent',
        },
      },
    });
    const deps = createDeps();
    const kanbanActions = useProductionKanbanActions(deps);

    await kanbanActions.saveDraftRecord('video1');

    expect(runStateUpdater(stateSetters[1], {}, 0)).toEqual({ video1: 'saving' });
    expect(deps.onUpdateVideoRecord).toHaveBeenCalledWith('video1', {
      draftTitle: 'Draft title',
      note: 'Draft note',
      scriptAnalysis: 'Draft analysis',
      scriptBody: 'Draft body',
      scriptOutline: 'Draft outline',
      scriptStatus: 'revision',
      targetPublishDate: '2026-07-21',
    });
    expect(runStateUpdater(stateSetters[1], { video1: 'saving' }, 1)).toEqual({ video1: 'saved' });

    vi.advanceTimersByTime(2200);

    expect(runStateUpdater(stateSetters[1], { video1: 'saved' }, 2)).toEqual({});
  });

  it('keeps the temporary error state when production draft save fails', async () => {
    const deps = createDeps({
      onUpdateVideoRecord: vi.fn(() => Promise.resolve(false)),
    });
    const kanbanActions = useProductionKanbanActions(deps);

    await kanbanActions.saveDraftRecord('video1');

    expect(runStateUpdater(stateSetters[1], {}, 0)).toEqual({ video1: 'saving' });
    expect(runStateUpdater(stateSetters[1], { video1: 'saving' }, 1)).toEqual({ video1: 'error' });

    vi.advanceTimersByTime(2200);

    expect(stateSetters[1]).toHaveBeenCalledTimes(2);
  });

  it('moves a video and clears the temporary saved state after success', async () => {
    const deps = createDeps();
    const kanbanActions = useProductionKanbanActions(deps);

    await kanbanActions.moveVideo('video1', 'production_active', { note: 'start now' });

    expect(runStateUpdater(stateSetters[2], {}, 0)).toEqual({ video1: 'saving' });
    expect(deps.onMoveVideo).toHaveBeenCalledWith('video1', 'production_active', { note: 'start now' });
    expect(runStateUpdater(stateSetters[2], { video1: 'saving' }, 1)).toEqual({ video1: 'saved' });

    vi.advanceTimersByTime(1600);

    expect(runStateUpdater(stateSetters[2], { video1: 'saved' }, 2)).toEqual({});
  });

  it('updates only the focus field without moving the production status', async () => {
    const deps = createDeps();
    const kanbanActions = useProductionKanbanActions(deps);

    await kanbanActions.updateVideoFocus('video1', '2026-07-13T09:30:00.000Z');

    expect(runStateUpdater(stateSetters[2], {}, 0)).toEqual({ video1: 'saving' });
    expect(deps.onUpdateVideoRecord).toHaveBeenCalledWith('video1', {
      focusPinnedAt: '2026-07-13T09:30:00.000Z',
    });
    expect(deps.onMoveVideo).not.toHaveBeenCalled();
    expect(runStateUpdater(stateSetters[2], { video1: 'saving' }, 1)).toEqual({ video1: 'saved' });

    vi.advanceTimersByTime(1600);

    expect(runStateUpdater(stateSetters[2], { video1: 'saved' }, 2)).toEqual({});
  });

  it('prevents duplicate focus or move requests for the same video while Cloud saving is pending', async () => {
    let resolveUpdate;
    const deps = createDeps({
      onUpdateVideoRecord: vi.fn(() => new Promise((resolve) => {
        resolveUpdate = resolve;
      })),
    });
    const kanbanActions = useProductionKanbanActions(deps);

    const firstRequest = kanbanActions.updateVideoFocus('video1', '2026-07-13T09:30:00.000Z');
    const duplicateResult = await kanbanActions.moveVideo('video1', 'production_active');

    expect(duplicateResult).toBe(false);
    expect(deps.onUpdateVideoRecord).toHaveBeenCalledTimes(1);
    expect(deps.onMoveVideo).not.toHaveBeenCalled();

    resolveUpdate(true);
    await expect(firstRequest).resolves.toBe(true);
  });

  it('shows an error state instead of leaving a rejected Cloud update pending', async () => {
    const deps = createDeps({
      onUpdateVideoRecord: vi.fn(() => Promise.reject(new Error('network failed'))),
    });
    const kanbanActions = useProductionKanbanActions(deps);

    await expect(kanbanActions.updateVideoFocus('video1', '2026-07-13T09:30:00.000Z')).resolves.toBe(false);

    expect(runStateUpdater(stateSetters[2], {}, 0)).toEqual({ video1: 'saving' });
    expect(runStateUpdater(stateSetters[2], { video1: 'saving' }, 1)).toEqual({ video1: 'error' });
  });

  it('does not move a discovery link when no Cloud update handler is provided', async () => {
    const deps = createDeps({ onUpdateDiscoveryLink: null });
    const kanbanActions = useProductionKanbanActions(deps);

    await kanbanActions.moveDiscoveryLink('link1', 'candidate');

    expect(stateSetters[3]).not.toHaveBeenCalled();
  });

  it('moves a discovery link with status-only updates and preserves error state on failure', async () => {
    const deps = createDeps({
      onUpdateDiscoveryLink: vi.fn(() => Promise.resolve(false)),
    });
    const kanbanActions = useProductionKanbanActions(deps);

    await kanbanActions.moveDiscoveryLink('link1', 'candidate');

    expect(runStateUpdater(stateSetters[3], {}, 0)).toEqual({ link1: 'saving' });
    expect(deps.onUpdateDiscoveryLink).toHaveBeenCalledWith('link1', { status: 'candidate' });
    expect(runStateUpdater(stateSetters[3], { link1: 'saving' }, 1)).toEqual({ link1: 'error' });

    vi.advanceTimersByTime(1600);

    expect(stateSetters[3]).toHaveBeenCalledTimes(2);
  });
});
