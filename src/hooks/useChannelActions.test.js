import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  createChannelMock,
  createChannelNoteMock,
  createChannelsBulkMock,
  removeChannelMock,
  updateChannelMock,
} = vi.hoisted(() => ({
  createChannelMock: vi.fn(),
  createChannelNoteMock: vi.fn(),
  createChannelsBulkMock: vi.fn(),
  removeChannelMock: vi.fn(),
  updateChannelMock: vi.fn(),
}));

vi.mock('react', () => ({
  useCallback: vi.fn((callback) => callback),
}));

vi.mock('../services/channelApi', () => ({
  createChannel: createChannelMock,
  createChannelNote: createChannelNoteMock,
  createChannelsBulk: createChannelsBulkMock,
  removeChannel: removeChannelMock,
  updateChannel: updateChannelMock,
}));

import { CHANNEL_STATUS } from '../constants/status';
import {
  createChannel,
  createChannelNote,
  createChannelsBulk,
  removeChannel,
  updateChannel,
} from '../services/channelApi';
import { useChannelActions } from './useChannelActions';

const existingChannel = {
  id: 'channel-1',
  category: '해외',
  title: 'Known Channel',
  status: CHANNEL_STATUS.ACTIVE,
};

const nextChannel = {
  id: 'channel-2',
  category: '해외',
  title: 'Fresh Channel',
  status: CHANNEL_STATUS.ACTIVE,
};

const createDeps = (overrides = {}) => ({
  setError: vi.fn(),
  setSavedChannels: vi.fn(),
  setSelectedChannelIds: vi.fn(),
  setUpdatingChannelId: vi.fn(),
  ...overrides,
});

const runStateUpdater = (setter, currentValue, callIndex = 0) => {
  const updater = setter.mock.calls[callIndex][0];
  return updater(currentValue);
};

describe('useChannelActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('window', {
      confirm: vi.fn(() => true),
    });

    createChannelMock.mockResolvedValue({
      success: true,
      channel: nextChannel,
    });
    createChannelsBulkMock.mockResolvedValue({
      success: true,
      total: 2,
      added: 2,
    });
    removeChannelMock.mockResolvedValue({
      success: true,
    });
    updateChannelMock.mockResolvedValue({
      success: true,
      channel: nextChannel,
    });
    createChannelNoteMock.mockResolvedValue({
      success: true,
      channel: nextChannel,
    });
  });

  it('saves a new Cloud channel and appends the returned channel to local state', async () => {
    const deps = createDeps();
    const { saveChannel } = useChannelActions(deps);

    await expect(saveChannel({
      handle: '@fresh',
      tags: ['해외'],
      language: 'en',
      note: 'priority',
    })).resolves.toEqual(nextChannel);

    expect(createChannel).toHaveBeenCalledWith({
      handle: '@fresh',
      tags: ['해외'],
      language: 'en',
      note: 'priority',
    });
    expect(runStateUpdater(deps.setSavedChannels, [existingChannel])).toEqual([
      existingChannel,
      nextChannel,
    ]);
  });

  it('does not append a channel when Cloud channel creation fails', async () => {
    createChannelMock.mockResolvedValueOnce({
      success: false,
      error: 'Cloud add failed',
    });
    const deps = createDeps();
    const { saveChannel } = useChannelActions(deps);

    await expect(saveChannel({
      handle: '@failed',
      tags: ['해외'],
      language: 'en',
      note: '',
    })).rejects.toThrow(
      'Cloud add failed 온라인 저장소(Azure DB)의 채널 저장 작업을 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );

    expect(deps.setSavedChannels).not.toHaveBeenCalled();
  });

  it('bulk-creates channels through the 온라인 저장 API(Azure) and returns the API result', async () => {
    const bulkResult = {
      success: true,
      total: 2,
      added: 1,
      skipped: 1,
    };
    createChannelsBulkMock.mockResolvedValueOnce(bulkResult);
    const { bulkCreateChannels } = useChannelActions(createDeps());

    await expect(bulkCreateChannels({
      handles: ['@one', '@two'],
      tags: ['해외'],
      language: 'en',
    })).resolves.toEqual(bulkResult);

    expect(createChannelsBulk).toHaveBeenCalledWith({
      handles: ['@one', '@two'],
      tags: ['해외'],
      language: 'en',
    });
  });

  it('does not delete a channel when the user cancels the confirm dialog', async () => {
    window.confirm.mockReturnValueOnce(false);
    const deps = createDeps();
    const { deleteChannel } = useChannelActions(deps);

    await deleteChannel(existingChannel.id, existingChannel.category, existingChannel.title);

    expect(removeChannel).not.toHaveBeenCalled();
    expect(deps.setSavedChannels).not.toHaveBeenCalled();
    expect(deps.setSelectedChannelIds).not.toHaveBeenCalled();
  });

  it('deletes a Cloud channel and removes it from saved and selected state', async () => {
    const deps = createDeps();
    const { deleteChannel } = useChannelActions(deps);

    await deleteChannel(existingChannel.id, existingChannel.category, existingChannel.title);

    expect(window.confirm).toHaveBeenCalledWith(expect.stringContaining('Known Channel'));
    expect(removeChannel).toHaveBeenCalledWith({
      id: existingChannel.id,
      category: existingChannel.category,
    });
    expect(runStateUpdater(deps.setSavedChannels, [existingChannel, nextChannel])).toEqual([nextChannel]);
    expect(runStateUpdater(deps.setSelectedChannelIds, ['channel-1', 'channel-2'])).toEqual(['channel-2']);
  });

  it('reports delete failures without changing channel state', async () => {
    removeChannelMock.mockResolvedValueOnce({
      success: false,
      error: 'Cloud delete failed',
    });
    const deps = createDeps();
    const { deleteChannel } = useChannelActions(deps);

    await deleteChannel(existingChannel.id, existingChannel.category, existingChannel.title);

    expect(deps.setError).toHaveBeenCalledWith(
      'Cloud delete failed 온라인 저장소(Azure DB)의 채널 삭제 작업을 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(deps.setSavedChannels).not.toHaveBeenCalled();
    expect(deps.setSelectedChannelIds).not.toHaveBeenCalled();
  });

  it('updates Cloud channel metadata and deselects non-active channels', async () => {
    const pausedChannel = {
      ...existingChannel,
      status: CHANNEL_STATUS.PAUSED,
    };
    updateChannelMock.mockResolvedValueOnce({
      success: true,
      channel: pausedChannel,
    });
    const deps = createDeps();
    const { updateChannelMetadata } = useChannelActions(deps);

    await updateChannelMetadata(existingChannel, { status: CHANNEL_STATUS.PAUSED });

    expect(deps.setUpdatingChannelId).toHaveBeenNthCalledWith(1, existingChannel.id);
    expect(deps.setError).toHaveBeenCalledWith('');
    expect(updateChannel).toHaveBeenCalledWith({
      id: existingChannel.id,
      category: existingChannel.category,
      updates: { status: CHANNEL_STATUS.PAUSED },
    });
    expect(runStateUpdater(deps.setSavedChannels, [existingChannel, nextChannel])).toEqual([
      pausedChannel,
      nextChannel,
    ]);
    expect(runStateUpdater(deps.setSelectedChannelIds, ['channel-1', 'channel-2'])).toEqual(['channel-2']);
    expect(deps.setUpdatingChannelId).toHaveBeenLastCalledWith(null);
  });

  it('reports metadata save failures and clears the updating marker', async () => {
    updateChannelMock.mockResolvedValueOnce({
      success: false,
      error: 'Cloud update failed',
    });
    const deps = createDeps();
    const { updateChannelMetadata } = useChannelActions(deps);

    await updateChannelMetadata(existingChannel, { grade: 'S' });

    expect(deps.setError).toHaveBeenLastCalledWith(
      'Cloud update failed 온라인 저장소(Azure DB)의 채널 정보 저장 작업을 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.',
    );
    expect(deps.setSavedChannels).not.toHaveBeenCalled();
    expect(deps.setSelectedChannelIds).not.toHaveBeenCalled();
    expect(deps.setUpdatingChannelId).toHaveBeenLastCalledWith(null);
  });

  it('saves a channel note through Cloud and replaces the returned channel', async () => {
    const notedChannel = {
      ...existingChannel,
      notes: [{ text: 'review later' }],
    };
    createChannelNoteMock.mockResolvedValueOnce({
      success: true,
      channel: notedChannel,
    });
    const deps = createDeps();
    const { saveChannelNote } = useChannelActions(deps);

    await expect(saveChannelNote({
      id: existingChannel.id,
      category: existingChannel.category,
      text: 'review later',
    })).resolves.toEqual(notedChannel);

    expect(createChannelNote).toHaveBeenCalledWith({
      id: existingChannel.id,
      category: existingChannel.category,
      text: 'review later',
    });
    expect(runStateUpdater(deps.setSavedChannels, [existingChannel, nextChannel])).toEqual([
      notedChannel,
      nextChannel,
    ]);
  });
});
