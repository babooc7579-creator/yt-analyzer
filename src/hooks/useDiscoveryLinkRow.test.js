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
import { useDiscoveryLinkRow } from './useDiscoveryLinkRow';

const baseLink = {
  id: 'link-1',
  title: 'Cake table',
  memo: 'Check source',
  url: 'https://www.instagram.com/reel/abc/',
  status: 'saved',
  rightsStatus: 'unknown',
};

const createChangeEvent = (value) => ({
  target: { value },
});

const setStateValues = (...values) => {
  stateValueOverrides.push(...values);
};

describe('useDiscoveryLinkRow', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    stateValueOverrides.length = 0;
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it('initializes row metadata and edit draft state from the discovery link', () => {
    const row = useDiscoveryLinkRow({
      link: baseLink,
      onDelete: vi.fn(),
      onUpdate: vi.fn(),
    });

    expect(useState).toHaveBeenNthCalledWith(1, false);
    expect(useState).toHaveBeenNthCalledWith(2, 'Cake table');
    expect(useState).toHaveBeenNthCalledWith(3, 'Check source');
    expect(useState).toHaveBeenNthCalledWith(4, '');
    expect(row).toMatchObject({
      currentRightsStatus: 'unknown',
      currentStatus: 'saved',
      draftMemo: 'Check source',
      draftTitle: 'Cake table',
      isEditing: false,
      platformLabel: 'Instagram',
      sourceHost: 'instagram.com',
      title: 'Cake table',
    });
  });

  it('deletes only after confirmation and never deletes the external source by itself', () => {
    const onDelete = vi.fn();
    const confirm = vi.fn(() => false);
    vi.stubGlobal('window', { confirm });
    const row = useDiscoveryLinkRow({
      link: baseLink,
      onDelete,
      onUpdate: vi.fn(),
    });

    row.handleDelete();

    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('Cloud 발견함에서 삭제'));
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining('외부 링크 자체는 삭제되지 않습니다'));
    expect(onDelete).not.toHaveBeenCalled();

    confirm.mockReturnValueOnce(true);
    row.handleDelete();

    expect(onDelete).toHaveBeenCalledWith('link-1');
  });

  it('updates status and rights status through Cloud update payloads', () => {
    const onUpdate = vi.fn();
    const row = useDiscoveryLinkRow({
      link: baseLink,
      onDelete: vi.fn(),
      onUpdate,
    });

    row.handleStatusChange(createChangeEvent('reviewing'));
    row.handleRightsStatusChange(createChangeEvent('needs_check'));

    expect(onUpdate).toHaveBeenNthCalledWith(1, 'link-1', { status: 'reviewing' });
    expect(onUpdate).toHaveBeenNthCalledWith(2, 'link-1', { rightsStatus: 'needs_check' });
    expect(stateSetters[3]).toHaveBeenCalledWith('');
  });

  it('reverts risky status or rights changes when the user declines confirmation', () => {
    const onUpdate = vi.fn();
    const confirm = vi.fn(() => false);
    vi.stubGlobal('window', { confirm });

    const doNotUseRow = useDiscoveryLinkRow({
      link: {
        ...baseLink,
        status: 'saved',
        rightsStatus: 'do_not_use',
      },
      onDelete: vi.fn(),
      onUpdate,
    });
    const statusEvent = createChangeEvent('candidate');

    doNotUseRow.handleStatusChange(statusEvent);

    expect(statusEvent.target.value).toBe('saved');
    expect(onUpdate).not.toHaveBeenCalled();

    const candidateRow = useDiscoveryLinkRow({
      link: {
        ...baseLink,
        status: 'candidate',
        rightsStatus: 'unknown',
      },
      onDelete: vi.fn(),
      onUpdate,
    });
    const rightsEvent = createChangeEvent('do_not_use');

    candidateRow.handleRightsStatusChange(rightsEvent);

    expect(rightsEvent.target.value).toBe('unknown');
    expect(onUpdate).not.toHaveBeenCalled();
    expect(confirm).toHaveBeenCalledTimes(2);
  });

  it('marks a link as candidate only when it is not already a candidate and confirmation allows it', async () => {
    const onUpdate = vi.fn(() => Promise.resolve(true));

    const existingCandidateRow = useDiscoveryLinkRow({
      link: {
        ...baseLink,
        status: 'candidate',
      },
      onDelete: vi.fn(),
      onUpdate,
    });

    await existingCandidateRow.handleSendToCandidate();
    expect(onUpdate).not.toHaveBeenCalled();

    const confirm = vi.fn(() => true);
    vi.stubGlobal('window', { confirm });
    const doNotUseRow = useDiscoveryLinkRow({
      link: {
        ...baseLink,
        rightsStatus: 'do_not_use',
      },
      onDelete: vi.fn(),
      onUpdate,
    });

    await doNotUseRow.handleSendToCandidate();

    expect(confirm).toHaveBeenCalled();
    expect(onUpdate).toHaveBeenCalledWith('link-1', { status: 'candidate' });
    expect(stateSetters[7]).toHaveBeenNthCalledWith(1, 'saving');
    expect(stateSetters[7]).toHaveBeenNthCalledWith(2, 'saved');
  });

  it('keeps failed candidate saves visible and opens the saved link in the candidate view', async () => {
    const onOpenProductionCandidates = vi.fn();
    const row = useDiscoveryLinkRow({
      link: baseLink,
      onDelete: vi.fn(),
      onOpenProductionCandidates,
      onUpdate: vi.fn(() => Promise.resolve(false)),
    });

    expect(await row.handleSendToCandidate()).toBe(false);
    expect(stateSetters[3]).toHaveBeenNthCalledWith(1, 'saving');
    expect(stateSetters[3]).toHaveBeenNthCalledWith(2, 'error');

    row.openProductionCandidate();
    expect(onOpenProductionCandidates).toHaveBeenCalledWith(baseLink);
  });

  it('opens and cancels edit mode by resetting draft values from the current link', () => {
    const row = useDiscoveryLinkRow({
      link: baseLink,
      onDelete: vi.fn(),
      onUpdate: vi.fn(),
    });

    row.openEdit();
    expect(stateSetters[1]).toHaveBeenCalledWith('Cake table');
    expect(stateSetters[2]).toHaveBeenCalledWith('Check source');
    expect(stateSetters[0]).toHaveBeenCalledWith(true);

    row.cancelEdit();
    expect(stateSetters[1]).toHaveBeenLastCalledWith('Cake table');
    expect(stateSetters[2]).toHaveBeenLastCalledWith('Check source');
    expect(stateSetters[0]).toHaveBeenLastCalledWith(false);
  });

  it('saves edited title and memo only when changed and closes edit mode on success', async () => {
    setStateValues(false, '  New title  ', '  New memo  ');
    const onUpdate = vi.fn(() => Promise.resolve(true));
    const row = useDiscoveryLinkRow({
      link: baseLink,
      onDelete: vi.fn(),
      onUpdate,
    });

    await row.handleSaveEdit();

    expect(onUpdate).toHaveBeenCalledWith('link-1', {
      title: 'New title',
      memo: 'New memo',
    });
    expect(stateSetters[0]).toHaveBeenCalledWith(false);
  });

  it('closes unchanged edits locally and keeps failed Cloud saves open', async () => {
    const unchangedUpdate = vi.fn();
    const unchangedRow = useDiscoveryLinkRow({
      link: baseLink,
      onDelete: vi.fn(),
      onUpdate: unchangedUpdate,
    });

    await unchangedRow.handleSaveEdit();

    expect(unchangedUpdate).not.toHaveBeenCalled();
    expect(stateSetters[0]).toHaveBeenCalledWith(false);

    stateSetters.length = 0;
    setStateValues(false, 'Changed title', 'Changed memo');
    const failedUpdate = vi.fn(() => Promise.resolve(false));
    const failedRow = useDiscoveryLinkRow({
      link: baseLink,
      onDelete: vi.fn(),
      onUpdate: failedUpdate,
    });

    await failedRow.handleSaveEdit();

    expect(failedUpdate).toHaveBeenCalledWith('link-1', {
      title: 'Changed title',
      memo: 'Changed memo',
    });
    expect(stateSetters[0]).not.toHaveBeenCalled();
  });
});
