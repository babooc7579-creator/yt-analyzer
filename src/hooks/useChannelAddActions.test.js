import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { fetchChannelPreview } from '../services/channelApi';
import {
  BULK_CHANNEL_EMPTY_INPUT_MESSAGE,
  BULK_CHANNEL_LIMIT_MESSAGE,
  CHANNEL_PREVIEW_DUPLICATE_MESSAGE,
} from '../utils/channelAddActions';
import { useChannelAddActions } from './useChannelAddActions';

vi.mock('../services/channelApi', () => ({
  fetchChannelPreview: vi.fn(),
}));

const createDeps = (overrides = {}) => ({
  bulkCreateChannels: vi.fn(() => Promise.resolve({ total: 2, added: 2 })),
  bulkInput: '',
  cancelChannelPreview: vi.fn(),
  channelPreview: null,
  loadChannelsFromCloud: vi.fn(() => Promise.resolve()),
  newChannelInput: '',
  newChannelLang: 'en',
  newChannelNote: '',
  newChannelTags: ['해외'],
  savedChannels: [],
  saveChannel: vi.fn(() => Promise.resolve({ success: true })),
  setBulkLoading: vi.fn(),
  setBulkResult: vi.fn(),
  setChannelPreview: vi.fn(),
  setError: vi.fn(),
  setLoading: vi.fn(),
  setPreviewLoading: vi.fn(),
  setProgressMsg: vi.fn(),
  setSelectedCategoryTab: vi.fn(),
  ...overrides,
});

describe('useChannelAddActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('does not call YouTube preview when the channel input is blank', async () => {
    const deps = createDeps({ newChannelInput: '   ' });
    const { handlePreviewChannel } = useChannelAddActions(deps);

    await handlePreviewChannel();

    expect(fetchChannelPreview).not.toHaveBeenCalled();
    expect(deps.setPreviewLoading).not.toHaveBeenCalled();
    expect(deps.setChannelPreview).not.toHaveBeenCalled();
  });

  it('loads a preview for a new channel and clears the previous preview first', async () => {
    const channel = { id: 'channel-1', title: 'Fresh Channel' };
    fetchChannelPreview.mockResolvedValueOnce({ success: true, channel });
    const deps = createDeps({ newChannelInput: '  @fresh  ' });
    const { handlePreviewChannel } = useChannelAddActions(deps);

    await handlePreviewChannel();

    expect(fetchChannelPreview).toHaveBeenCalledWith('@fresh');
    expect(deps.setPreviewLoading).toHaveBeenNthCalledWith(1, true);
    expect(deps.setPreviewLoading).toHaveBeenLastCalledWith(false);
    expect(deps.setError).toHaveBeenCalledWith('');
    expect(deps.setChannelPreview).toHaveBeenNthCalledWith(1, null);
    expect(deps.setChannelPreview).toHaveBeenLastCalledWith(channel);
  });

  it('blocks duplicate preview results before saving a channel', async () => {
    fetchChannelPreview.mockResolvedValueOnce({
      success: true,
      channel: { id: 'channel-1', title: 'Known Channel' },
    });
    const deps = createDeps({
      newChannelInput: '@known',
      savedChannels: [{ id: 'channel-1' }],
    });
    const { handlePreviewChannel } = useChannelAddActions(deps);

    await handlePreviewChannel();

    expect(deps.setError).toHaveBeenCalledWith(CHANNEL_PREVIEW_DUPLICATE_MESSAGE);
    expect(deps.setChannelPreview).not.toHaveBeenCalledWith({ id: 'channel-1', title: 'Known Channel' });
  });

  it('shows a preview error and allows the next confirmation attempt to recover', async () => {
    fetchChannelPreview
      .mockRejectedValueOnce(new Error('채널 주소를 확인해 주세요.'))
      .mockResolvedValueOnce({
        success: true,
        channel: { id: 'channel-2', title: 'Recovered Channel' },
      });
    const deps = createDeps({ newChannelInput: '@retry-channel' });
    const { handlePreviewChannel } = useChannelAddActions(deps);

    await handlePreviewChannel();
    await handlePreviewChannel();

    expect(fetchChannelPreview).toHaveBeenCalledTimes(2);
    expect(deps.setError).toHaveBeenCalledWith('채널 주소를 확인해 주세요.');
    expect(deps.setError).toHaveBeenLastCalledWith('');
    expect(deps.setChannelPreview).toHaveBeenLastCalledWith({
      id: 'channel-2',
      title: 'Recovered Channel',
    });
    expect(deps.setPreviewLoading).toHaveBeenLastCalledWith(false);
  });

  it('saves a confirmed preview as a Cloud channel and selects its first tag', async () => {
    const deps = createDeps({
      channelPreview: { id: 'channel-2', title: 'Ready Channel' },
      newChannelInput: '  @ready  ',
      newChannelLang: 'ko',
      newChannelNote: 'priority',
      newChannelTags: ['역사', '쇼츠'],
    });
    const { handleSaveChannel } = useChannelAddActions(deps);

    await handleSaveChannel();

    expect(deps.saveChannel).toHaveBeenCalledWith({
      handle: '@ready',
      tags: ['역사', '쇼츠'],
      language: 'ko',
      note: 'priority',
    });
    expect(deps.setSelectedCategoryTab).toHaveBeenCalledWith('역사');
    expect(deps.cancelChannelPreview).toHaveBeenCalled();
    expect(deps.setLoading).toHaveBeenNthCalledWith(1, true);
    expect(deps.setLoading).toHaveBeenLastCalledWith(false);
  });

  it('does not bulk-create channels when the bulk input is empty', async () => {
    const deps = createDeps({ bulkInput: ' \n  ' });
    const { handleBulkAdd } = useChannelAddActions(deps);

    await handleBulkAdd();

    expect(deps.setError).toHaveBeenCalledWith(BULK_CHANNEL_EMPTY_INPUT_MESSAGE);
    expect(deps.bulkCreateChannels).not.toHaveBeenCalled();
    expect(deps.setBulkLoading).not.toHaveBeenCalled();
  });

  it('blocks more than 50 bulk channels before any YouTube or Azure request', async () => {
    const deps = createDeps({ bulkInput: Array.from({ length: 51 }, (_, index) => `@channel-${index}`).join('\n') });
    const { handleBulkAdd } = useChannelAddActions(deps);

    await handleBulkAdd();

    expect(deps.setError).toHaveBeenCalledWith(BULK_CHANNEL_LIMIT_MESSAGE);
    expect(deps.bulkCreateChannels).not.toHaveBeenCalled();
    expect(deps.setBulkLoading).not.toHaveBeenCalled();
  });

  it('bulk-creates trimmed handles and reloads Cloud channels after success', async () => {
    const result = { total: 2, added: 2 };
    const deps = createDeps({
      bulkCreateChannels: vi.fn(() => Promise.resolve(result)),
      bulkInput: ' @one \n@two\n',
      newChannelLang: 'en',
      newChannelTags: ['해외'],
    });
    const { handleBulkAdd } = useChannelAddActions(deps);

    await handleBulkAdd();

    expect(deps.bulkCreateChannels).toHaveBeenCalledWith({
      handles: ['@one', '@two'],
      tags: ['해외'],
      language: 'en',
    });
    expect(deps.setBulkResult).toHaveBeenCalledWith(result);
    expect(deps.setSelectedCategoryTab).toHaveBeenCalledWith('해외');
    expect(deps.loadChannelsFromCloud).toHaveBeenCalled();
    expect(deps.setBulkLoading).toHaveBeenNthCalledWith(1, true);
    expect(deps.setBulkLoading).toHaveBeenLastCalledWith(false);
  });
});
