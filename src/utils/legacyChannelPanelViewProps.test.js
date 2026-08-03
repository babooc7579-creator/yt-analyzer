import { describe, expect, it } from 'vitest';

import { CHANNEL_STATUS } from '../constants/status';
import { getChannelScanDisplay } from './channelScanDisplay';
import { getLegacyChannelPanelViewProps } from './legacyChannelPanelViewProps';

describe('legacyChannelPanelViewProps utils', () => {
  it('builds grouped channel panel props with safe channel and category lists', () => {
    const categories = ['news', 'history'];
    const savedChannels = [
      { id: 'active1', title: 'Active channel', tags: ['news'], status: CHANNEL_STATUS.ACTIVE },
      { id: 'paused1', title: 'Paused channel', tags: ['news'], status: CHANNEL_STATUS.PAUSED },
      null,
      'bad',
    ];
    const selectedChannelIds = ['active1'];

    const props = getLegacyChannelPanelViewProps({
      apiKey: 'api-key',
      categories,
      error: 'load failed',
      loading: false,
      operationSource: 'youtube-video-search',
      progressMsg: 'ready',
      savedChannels,
      selectedCategoryTab: 'news',
      selectedChannelIds,
      showWorkPanel: true,
    });

    expect(props).toMatchObject({
      operationSource: 'youtube-video-search',
      showWorkPanel: true,
      introProps: {
        apiKey: 'api-key',
      },
      footerProps: {
        error: 'load failed',
        loading: false,
        progressMsg: 'ready',
        selectedChannelCount: 1,
      },
    });
    expect(props.channelAddFormProps.categories).toEqual(categories);
    expect(props.channelListProps.channels).toEqual(savedChannels.slice(0, 2));
    expect(props.channelListProps.selectedChannelIds).toEqual(selectedChannelIds);
    expect(props.tagTabsProps.categories).toEqual(categories);
    expect(props.tagTabsProps.channels).toEqual(savedChannels.slice(0, 2));
  });

  it('exposes scan display helpers and scannable channel counts by category', () => {
    const props = getLegacyChannelPanelViewProps({
      categories: ['news'],
      savedChannels: [
        { id: 'active1', tags: ['news'], status: CHANNEL_STATUS.ACTIVE },
        { id: 'paused1', tags: ['news'], status: CHANNEL_STATUS.PAUSED },
        { id: 'active2', tags: ['history'], status: CHANNEL_STATUS.ACTIVE },
      ],
      selectedCategoryTab: 'news',
    });

    expect(props.channelListProps.getScanDisplay).toBe(getChannelScanDisplay);
    expect(props.tagTabsProps.getScannableChannelCount('news')).toBe(1);
    expect(props.tagTabsProps.getScannableChannelCount('history')).toBe(1);
    expect(props.tagTabsProps.getScannableChannelCount('missing')).toBe(0);
  });

  it('forwards add form, channel list, footer, intro, and tag tab handlers', () => {
    const handlers = {
      cancelChannelPreview: () => 'cancel preview',
      cancelRenameCategory: () => 'cancel rename',
      confirmRenameCategory: () => 'confirm rename',
      handleBulkAdd: () => 'bulk',
      handlePreviewChannel: () => 'preview',
      handleSaveChannel: () => 'save',
      handleTagScan: () => 'scan',
      onChangeApiKey: () => 'api',
      onDeleteChannel: () => 'delete',
      onLoadStoredVideos: () => 'load',
      onOpenNotes: () => 'notes',
      onToggleChannelSelection: () => 'toggle',
      onUpdateChannelMetadata: () => 'metadata',
      resetBulkAdd: () => 'reset',
      setAddMode: () => 'mode',
      setBulkInput: () => 'bulk input',
      setCategories: () => 'categories',
      setIsEditingCategory: () => 'editing',
      setNewCategoryName: () => 'new category',
      setNewChannelInput: () => 'input',
      setNewChannelLang: () => 'lang',
      setNewChannelNote: () => 'note',
      setRenameValue: () => 'rename value',
      setSelectedCategoryTab: () => 'category',
      startRenameCategory: () => 'start rename',
      toggleNewChannelTag: () => 'tag',
    };

    const props = getLegacyChannelPanelViewProps({
      ...handlers,
      addMode: 'single',
      bulkInput: '@one',
      bulkLoading: true,
      bulkResult: { created: 1 },
      channelPreview: { title: 'Preview' },
      channelsLoading: true,
      cloudOnlyTags: ['news'],
      isEditingCategory: true,
      isScanning: true,
      loading: true,
      newCategoryName: 'new',
      newChannelInput: '@channel',
      newChannelLang: 'en',
      newChannelNote: 'watch',
      newChannelTags: ['news'],
      previewLoading: true,
      renameLoading: true,
      renameValue: 'rename',
      renamingCategory: 'old',
      scanningTag: 'news',
      selectedCategoryTab: 'news',
      updatingChannelId: 'channel1',
    });

    expect(props.channelAddFormProps).toMatchObject({
      addMode: 'single',
      bulkInput: '@one',
      bulkLoading: true,
      bulkResult: { created: 1 },
      channelPreview: { title: 'Preview' },
      cloudOnlyTags: ['news'],
      isEditingCategory: true,
      loading: true,
      newCategoryName: 'new',
      newChannelInput: '@channel',
      newChannelLang: 'en',
      newChannelNote: 'watch',
      newChannelTags: ['news'],
      previewLoading: true,
      renameLoading: true,
      renameValue: 'rename',
      renamingCategory: 'old',
    });
    expect(props.channelAddFormProps.cancelChannelPreview).toBe(handlers.cancelChannelPreview);
    expect(props.channelAddFormProps.cancelRenameCategory).toBe(handlers.cancelRenameCategory);
    expect(props.channelAddFormProps.confirmRenameCategory).toBe(handlers.confirmRenameCategory);
    expect(props.channelAddFormProps.handleBulkAdd).toBe(handlers.handleBulkAdd);
    expect(props.channelAddFormProps.handlePreviewChannel).toBe(handlers.handlePreviewChannel);
    expect(props.channelAddFormProps.handleSaveChannel).toBe(handlers.handleSaveChannel);
    expect(props.channelAddFormProps.resetBulkAdd).toBe(handlers.resetBulkAdd);
    expect(props.channelAddFormProps.setAddMode).toBe(handlers.setAddMode);
    expect(props.channelAddFormProps.setBulkInput).toBe(handlers.setBulkInput);
    expect(props.channelAddFormProps.setCategories).toBe(handlers.setCategories);
    expect(props.channelAddFormProps.setIsEditingCategory).toBe(handlers.setIsEditingCategory);
    expect(props.channelAddFormProps.setNewCategoryName).toBe(handlers.setNewCategoryName);
    expect(props.channelAddFormProps.setNewChannelInput).toBe(handlers.setNewChannelInput);
    expect(props.channelAddFormProps.setNewChannelLang).toBe(handlers.setNewChannelLang);
    expect(props.channelAddFormProps.setNewChannelNote).toBe(handlers.setNewChannelNote);
    expect(props.channelAddFormProps.setRenameValue).toBe(handlers.setRenameValue);
    expect(props.channelAddFormProps.startRenameCategory).toBe(handlers.startRenameCategory);
    expect(props.channelAddFormProps.toggleNewChannelTag).toBe(handlers.toggleNewChannelTag);

    expect(props.channelListProps.channelsLoading).toBe(true);
    expect(props.channelListProps.onDelete).toBe(handlers.onDeleteChannel);
    expect(props.channelListProps.onOpenNotes).toBe(handlers.onOpenNotes);
    expect(props.channelListProps.onToggleSelection).toBe(handlers.onToggleChannelSelection);
    expect(props.channelListProps.onUpdateMetadata).toBe(handlers.onUpdateChannelMetadata);
    expect(props.channelListProps.selectedCategory).toBe('news');
    expect(props.channelListProps.updatingChannelId).toBe('channel1');
    expect(props.footerProps.onLoadStoredVideos).toBe(handlers.onLoadStoredVideos);
    expect(props.introProps.onChangeApiKey).toBe(handlers.onChangeApiKey);
    expect(props.tagTabsProps.isScanning).toBe(true);
    expect(props.tagTabsProps.onScanTag).toBe(handlers.handleTagScan);
    expect(props.tagTabsProps.onSelectCategory).toBe(handlers.setSelectedCategoryTab);
    expect(props.tagTabsProps.scanningTag).toBe('news');
    expect(props.tagTabsProps.selectedCategory).toBe('news');
  });
});
