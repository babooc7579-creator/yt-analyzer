import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  createDiscoveryLinkMock,
  deleteDiscoveryLinkMock,
  fetchDiscoveryLinksMock,
  stateOverrides,
  stateSetters,
  updateDiscoveryLinkMock,
} = vi.hoisted(() => ({
  createDiscoveryLinkMock: vi.fn(),
  deleteDiscoveryLinkMock: vi.fn(),
  fetchDiscoveryLinksMock: vi.fn(),
  stateOverrides: [],
  stateSetters: [],
  updateDiscoveryLinkMock: vi.fn(),
}));

vi.mock('react', () => ({
  useCallback: vi.fn((callback) => callback),
  useEffect: vi.fn((effect) => {
    const cleanup = effect();
    return cleanup;
  }),
  useMemo: vi.fn((factory) => factory()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const stateValue = stateOverrides.length
      ? stateOverrides.shift()
      : (typeof initialValue === 'function' ? initialValue() : initialValue);

    return [stateValue, setter];
  }),
}));

vi.mock('../services/discoveryLinksApi', () => ({
  createDiscoveryLink: createDiscoveryLinkMock,
  deleteDiscoveryLink: deleteDiscoveryLinkMock,
  fetchDiscoveryLinks: fetchDiscoveryLinksMock,
  updateDiscoveryLink: updateDiscoveryLinkMock,
}));

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDiscoveryLink,
  deleteDiscoveryLink,
  fetchDiscoveryLinks,
  updateDiscoveryLink,
} from '../services/discoveryLinksApi';
import {
  DISCOVERY_LINK_DELETE_FAILED_MESSAGE,
  DISCOVERY_LINK_LOAD_FAILED_MESSAGE,
  DISCOVERY_LINK_SAVE_FAILED_MESSAGE,
  DISCOVERY_LINK_STATUS_SAVE_FAILED_MESSAGE,
  DISCOVERY_LINK_SAVING_MESSAGES,
} from '../utils/discoveryLinkActionCopy';
import { useDiscoveryLinks } from './useDiscoveryLinks';

const oldLink = {
  id: 'old',
  title: 'Old Clip',
  url: 'https://example.com/old',
  status: 'saved',
  rightsStatus: 'unknown',
  updatedAt: '2026-07-01T00:00:00.000Z',
};

const newLink = {
  id: 'new',
  title: 'New Clip',
  url: 'https://example.com/new',
  status: 'candidate',
  rightsStatus: 'needs_check',
  updatedAt: '2026-07-02T00:00:00.000Z',
};

const flushPromises = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

const setDiscoveryLinksState = ({
  error = '',
  links = [],
  loading = false,
  notice = '',
  saving = false,
  savingAction = '',
} = {}) => {
  stateOverrides.push(links, loading, saving, error, notice, savingAction);
};

describe('useDiscoveryLinks', () => {
  beforeEach(() => {
    stateOverrides.length = 0;
    stateSetters.length = 0;
    vi.clearAllMocks();

    createDiscoveryLinkMock.mockReset();
    deleteDiscoveryLinkMock.mockReset();
    fetchDiscoveryLinksMock.mockReset();
    updateDiscoveryLinkMock.mockReset();

    createDiscoveryLinkMock.mockResolvedValue({
      success: true,
      link: newLink,
    });
    deleteDiscoveryLinkMock.mockResolvedValue({ success: true });
    fetchDiscoveryLinksMock.mockResolvedValue({
      success: true,
      links: [],
    });
    updateDiscoveryLinkMock.mockResolvedValue({
      success: true,
      link: newLink,
    });
  });

  it('loads Cloud discovery links on mount and sorts current links by recent update', async () => {
    setDiscoveryLinksState({ links: [oldLink, newLink] });
    fetchDiscoveryLinksMock.mockResolvedValueOnce({
      success: true,
      items: [oldLink],
    });

    const discoveryHook = useDiscoveryLinks();
    await flushPromises();

    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [[oldLink, newLink]]);
    expect(useCallback).toHaveBeenCalled();
    expect(useEffect).toHaveBeenCalledTimes(1);
    expect(discoveryHook.discoveryLinks.map(link => link.id)).toEqual(['new', 'old']);
    expect(fetchDiscoveryLinks).toHaveBeenCalledTimes(1);
    expect(stateSetters[1]).toHaveBeenNthCalledWith(1, true);
    expect(stateSetters[3]).toHaveBeenNthCalledWith(1, '');
    expect(stateSetters[0]).toHaveBeenCalledWith([oldLink]);
    expect(stateSetters[1]).toHaveBeenLastCalledWith(false);
  });

  it('keeps Cloud load failures visible and does not replace links with local data', async () => {
    fetchDiscoveryLinksMock.mockResolvedValueOnce({
      success: false,
      error: 'Cloud discovery unavailable',
    });

    useDiscoveryLinks();
    await flushPromises();

    expect(stateSetters[3]).toHaveBeenLastCalledWith('Cloud discovery unavailable');
    expect(stateSetters[1]).toHaveBeenLastCalledWith(false);
    expect(stateSetters[0]).not.toHaveBeenCalled();

    fetchDiscoveryLinksMock.mockRejectedValueOnce(new Error('network failed'));
    useDiscoveryLinks();
    await flushPromises();

    expect(stateSetters[9]).toHaveBeenCalledWith('network failed');
  });

  it('uses the centralized load fallback message when the Cloud load error has no message', async () => {
    fetchDiscoveryLinksMock.mockResolvedValueOnce({
      success: false,
      error: '',
    });

    useDiscoveryLinks();
    await flushPromises();

    expect(stateSetters[3]).toHaveBeenLastCalledWith(DISCOVERY_LINK_LOAD_FAILED_MESSAGE);
  });

  it('creates a discovery link through Cloud and upserts the returned link', async () => {
    fetchDiscoveryLinksMock.mockReturnValueOnce(new Promise(() => {}));
    const discoveryHook = useDiscoveryLinks();
    const payload = {
      url: 'https://example.com/new',
      title: 'New Clip',
      status: 'saved',
      rightsStatus: 'unknown',
    };

    const created = await discoveryHook.addDiscoveryLink(payload);

    expect(created).toBe(true);
    expect(createDiscoveryLink).toHaveBeenCalledWith(payload);
    expect(stateSetters[2]).toHaveBeenNthCalledWith(1, true);
    expect(stateSetters[5]).toHaveBeenNthCalledWith(1, 'create');
    expect(stateSetters[3]).toHaveBeenNthCalledWith(1, '');
    expect(stateSetters[4]).toHaveBeenNthCalledWith(1, '');
    expect(stateSetters[0]).toHaveBeenCalledWith(expect.any(Function));

    const upsert = stateSetters[0].mock.calls[0][0];
    expect(upsert([oldLink]).map(link => link.id)).toEqual(['new', 'old']);
    expect(stateSetters[4]).toHaveBeenCalledWith('New Clip 링크를 온라인 발견함(Azure DB)에 저장했습니다.');
    expect(stateSetters[2]).toHaveBeenLastCalledWith(false);
    expect(stateSetters[5]).toHaveBeenLastCalledWith('');
  });

  it('reloads discovery links when create succeeds without a returned link', async () => {
    fetchDiscoveryLinksMock
      .mockReturnValueOnce(new Promise(() => {}))
      .mockResolvedValueOnce({
        success: true,
        links: [newLink],
      });
    createDiscoveryLinkMock.mockResolvedValueOnce({ success: true });
    const discoveryHook = useDiscoveryLinks();

    const created = await discoveryHook.addDiscoveryLink({
      url: 'https://example.com/new',
      title: 'New Clip',
    });

    expect(created).toBe(true);
    expect(fetchDiscoveryLinks).toHaveBeenCalledTimes(2);
    expect(stateSetters[0]).toHaveBeenCalledWith([newLink]);
  });

  it('does not update the link list when Cloud create fails', async () => {
    fetchDiscoveryLinksMock.mockReturnValueOnce(new Promise(() => {}));
    createDiscoveryLinkMock.mockResolvedValueOnce({
      success: false,
      error: '',
    });
    const discoveryHook = useDiscoveryLinks();

    const created = await discoveryHook.addDiscoveryLink({ url: 'https://example.com/fail' });

    expect(created).toBe(false);
    expect(stateSetters[0]).not.toHaveBeenCalled();
    expect(stateSetters[3]).toHaveBeenCalledWith(
      `${DISCOVERY_LINK_SAVE_FAILED_MESSAGE} 온라인 저장소(Azure DB) 저장 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`,
    );
    expect(stateSetters[2]).toHaveBeenLastCalledWith(false);
    expect(stateSetters[5]).toHaveBeenLastCalledWith('');
  });

  it('updates a discovery link through Cloud and replaces the returned link', async () => {
    fetchDiscoveryLinksMock.mockReturnValueOnce(new Promise(() => {}));
    setDiscoveryLinksState({ links: [oldLink] });
    updateDiscoveryLinkMock.mockResolvedValueOnce({
      success: true,
      link: { ...oldLink, status: 'candidate' },
    });
    const discoveryHook = useDiscoveryLinks();

    const changed = await discoveryHook.changeDiscoveryLink('old', { status: 'candidate' });

    expect(changed).toBe(true);
    expect(updateDiscoveryLink).toHaveBeenCalledWith({
      id: 'old',
      updates: { status: 'candidate' },
    });
    expect(stateSetters[5]).toHaveBeenNthCalledWith(1, 'update_status');
    expect(stateSetters[0]).toHaveBeenCalledWith(expect.any(Function));

    const replace = stateSetters[0].mock.calls[0][0];
    expect(replace([oldLink])).toEqual([{ ...oldLink, status: 'candidate' }]);
    expect(stateSetters[4]).toHaveBeenCalledWith(
      "Old Clip의 검토 상태를 '제작 후보'로 표시했습니다. 제작 후보함에서 이어서 확인할 수 있습니다.",
    );
  });

  it('shows the matching saving message for the current saving action', () => {
    fetchDiscoveryLinksMock.mockReturnValueOnce(new Promise(() => {}));
    setDiscoveryLinksState({
      saving: true,
      savingAction: 'update_rights',
    });

    const discoveryHook = useDiscoveryLinks();

    expect(discoveryHook.discoveryLinksSavingMessage).toBe(
      DISCOVERY_LINK_SAVING_MESSAGES.update_rights
    );
  });

  it('does not update the link list when Cloud update fails', async () => {
    fetchDiscoveryLinksMock.mockReturnValueOnce(new Promise(() => {}));
    setDiscoveryLinksState({ links: [oldLink] });
    updateDiscoveryLinkMock.mockResolvedValueOnce({
      success: false,
      error: '',
    });
    const discoveryHook = useDiscoveryLinks();

    const changed = await discoveryHook.changeDiscoveryLink('old', { status: 'candidate' });

    expect(changed).toBe(false);
    expect(stateSetters[0]).not.toHaveBeenCalled();
    expect(stateSetters[3]).toHaveBeenCalledWith(
      `${DISCOVERY_LINK_STATUS_SAVE_FAILED_MESSAGE} 온라인 저장소(Azure DB) 변경 저장 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`,
    );
  });

  it('deletes a discovery link through Cloud and removes it from the list', async () => {
    fetchDiscoveryLinksMock.mockReturnValueOnce(new Promise(() => {}));
    setDiscoveryLinksState({ links: [oldLink, newLink] });
    const discoveryHook = useDiscoveryLinks();

    const removed = await discoveryHook.removeDiscoveryLink('old');

    expect(removed).toBe(true);
    expect(deleteDiscoveryLink).toHaveBeenCalledWith('old');
    expect(stateSetters[5]).toHaveBeenNthCalledWith(1, 'delete');
    expect(stateSetters[0]).toHaveBeenCalledWith(expect.any(Function));

    const remove = stateSetters[0].mock.calls[0][0];
    expect(remove([oldLink, newLink])).toEqual([newLink]);
    expect(stateSetters[4]).toHaveBeenCalledWith('Old Clip 링크 기록을 온라인 발견함(Azure DB)에서 삭제했습니다.');
  });

  it('does not remove a discovery link from the list when Cloud delete fails', async () => {
    fetchDiscoveryLinksMock.mockReturnValueOnce(new Promise(() => {}));
    setDiscoveryLinksState({ links: [oldLink] });
    deleteDiscoveryLinkMock.mockResolvedValueOnce({
      success: false,
      error: '',
    });
    const discoveryHook = useDiscoveryLinks();

    const removed = await discoveryHook.removeDiscoveryLink('old');

    expect(removed).toBe(false);
    expect(stateSetters[0]).not.toHaveBeenCalled();
    expect(stateSetters[3]).toHaveBeenCalledWith(
      `${DISCOVERY_LINK_DELETE_FAILED_MESSAGE} 온라인 저장소(Azure DB) 삭제 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`,
    );
  });
});
