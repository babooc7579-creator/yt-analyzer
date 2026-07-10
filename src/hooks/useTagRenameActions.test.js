import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { renameTag } from '../services/channelApi';
import {
  TAG_RENAME_DUPLICATE_MESSAGE,
  TAG_RENAME_FAILED_MESSAGE,
  getRenamedCategories,
  getTagRenameCompleteMessage,
  getTagRenameErrorMessage,
  getTagRenameStartMessage,
} from '../utils/tagRenameActions';
import { useTagRenameActions } from './useTagRenameActions';

vi.mock('../services/channelApi', () => ({
  renameTag: vi.fn(),
}));

const createDeps = (overrides = {}) => ({
  cancelRenameCategory: vi.fn(),
  categories: ['해외', '예능'],
  loadChannelsFromCloud: vi.fn(() => Promise.resolve()),
  renameValue: '해외 레퍼런스',
  renamingCategory: '해외',
  selectedCategoryTab: '해외',
  setCategories: vi.fn(),
  setError: vi.fn(),
  setProgressMsg: vi.fn(),
  setRenameLoading: vi.fn(),
  setSelectedCategoryTab: vi.fn(),
  ...overrides,
});

const runStateUpdater = (setter, currentValue, callIndex = 0) => {
  const updater = setter.mock.calls[callIndex][0];
  return updater(currentValue);
};

describe('useTagRenameActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.stubGlobal('window', {
      confirm: vi.fn(() => true),
    });

    renameTag.mockResolvedValue({
      success: true,
      channelsAffected: 3,
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('cancels rename mode when the rename target is blank or unchanged', async () => {
    const blankDeps = createDeps({ renameValue: '   ' });
    await useTagRenameActions(blankDeps).confirmRenameCategory();

    const unchangedDeps = createDeps({ renameValue: '해외' });
    await useTagRenameActions(unchangedDeps).confirmRenameCategory();

    expect(blankDeps.cancelRenameCategory).toHaveBeenCalledTimes(1);
    expect(unchangedDeps.cancelRenameCategory).toHaveBeenCalledTimes(1);
    expect(renameTag).not.toHaveBeenCalled();
    expect(window.confirm).not.toHaveBeenCalled();
  });

  it('blocks duplicate category names before showing the Cloud update confirm dialog', async () => {
    const deps = createDeps({ renameValue: '예능' });

    await useTagRenameActions(deps).confirmRenameCategory();

    expect(deps.setError).toHaveBeenCalledWith(TAG_RENAME_DUPLICATE_MESSAGE);
    expect(window.confirm).not.toHaveBeenCalled();
    expect(renameTag).not.toHaveBeenCalled();
  });

  it('does not call Cloud rename when the user cancels the confirm dialog', async () => {
    window.confirm.mockReturnValueOnce(false);
    const deps = createDeps();

    await useTagRenameActions(deps).confirmRenameCategory();

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Cloud DB'));
    expect(renameTag).not.toHaveBeenCalled();
    expect(deps.setRenameLoading).not.toHaveBeenCalled();
    expect(deps.setCategories).not.toHaveBeenCalled();
  });

  it('renames a Cloud tag, reloads Cloud channels, and closes rename mode after success', async () => {
    const deps = createDeps();

    await useTagRenameActions(deps).confirmRenameCategory();

    expect(deps.setRenameLoading).toHaveBeenNthCalledWith(1, true);
    expect(deps.setError).toHaveBeenCalledWith('');
    expect(deps.setProgressMsg).toHaveBeenNthCalledWith(1, getTagRenameStartMessage('해외', '해외 레퍼런스'));
    expect(renameTag).toHaveBeenCalledWith({
      from: '해외',
      to: '해외 레퍼런스',
    });
    expect(runStateUpdater(deps.setCategories, ['해외', '예능'])).toEqual(
      getRenamedCategories(['해외', '예능'], '해외', '해외 레퍼런스'),
    );
    expect(deps.setSelectedCategoryTab).toHaveBeenCalledWith('해외 레퍼런스');
    expect(deps.setProgressMsg).toHaveBeenNthCalledWith(2, getTagRenameCompleteMessage({
      from: '해외',
      to: '해외 레퍼런스',
      channelsAffected: 3,
    }));
    expect(deps.loadChannelsFromCloud).toHaveBeenCalledTimes(1);
    expect(deps.cancelRenameCategory).toHaveBeenCalledTimes(1);
    expect(deps.setRenameLoading).toHaveBeenLastCalledWith(false);

    vi.advanceTimersByTime(4000);

    expect(deps.setProgressMsg).toHaveBeenLastCalledWith('');
  });

  it('keeps the selected category when another category is renamed', async () => {
    const deps = createDeps({ selectedCategoryTab: '예능' });

    await useTagRenameActions(deps).confirmRenameCategory();

    expect(deps.setSelectedCategoryTab).not.toHaveBeenCalled();
  });

  it('reports Cloud rename failures without updating categories or reloading channels', async () => {
    renameTag.mockResolvedValueOnce({
      success: false,
      error: '',
    });
    const deps = createDeps();

    await useTagRenameActions(deps).confirmRenameCategory();

    expect(deps.setError).toHaveBeenCalledWith(getTagRenameErrorMessage(new Error(TAG_RENAME_FAILED_MESSAGE)));
    expect(deps.setCategories).not.toHaveBeenCalled();
    expect(deps.setSelectedCategoryTab).not.toHaveBeenCalled();
    expect(deps.loadChannelsFromCloud).not.toHaveBeenCalled();
    expect(deps.cancelRenameCategory).not.toHaveBeenCalled();
    expect(deps.setRenameLoading).toHaveBeenLastCalledWith(false);
  });
});
