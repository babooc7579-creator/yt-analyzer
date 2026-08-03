import { describe, expect, it } from 'vitest';

import { getLegacyChannelPanelProps } from './legacyChannelPanelProps';

describe('legacyChannelPanelProps utils', () => {
  it('preserves channel panel state and list props', () => {
    const categories = ['news', 'history'];
    const savedChannels = [{ id: 'channel1' }];
    const selectedChannelIds = ['channel1'];

    const props = getLegacyChannelPanelProps({
      addMode: 'single',
      apiKey: 'api-key',
      categories,
      creatorViewIntent: { operationStage: 'add', source: 'youtube-video-search' },
      newChannelInput: '@channel',
      newChannelLang: 'en',
      newChannelNote: 'watch closely',
      newChannelTags: ['news'],
      savedChannels,
      selectedCategoryTab: 'news',
      selectedChannelIds,
      showWorkPanel: true,
    });

    expect(props).toMatchObject({
      addMode: 'single',
      apiKey: 'api-key',
      categories,
      operationSource: 'youtube-video-search',
      newChannelInput: '@channel',
      newChannelLang: 'en',
      newChannelNote: 'watch closely',
      newChannelTags: ['news'],
      savedChannels,
      selectedCategoryTab: 'news',
      selectedChannelIds,
      showWorkPanel: true,
    });
  });

  it('maps shared channel handlers to the panel callback names', () => {
    const deleteChannel = () => 'delete';
    const loadStoredVideosForSelectedChannels = () => 'load';
    const openNotesModal = () => 'notes';
    const setApiKey = () => 'api';
    const toggleChannelSelection = () => 'toggle';
    const updateChannelMetadata = () => 'metadata';

    const props = getLegacyChannelPanelProps({
      deleteChannel,
      loadStoredVideosForSelectedChannels,
      openNotesModal,
      setApiKey,
      toggleChannelSelection,
      updateChannelMetadata,
    });

    expect(props.onChangeApiKey).toBe(setApiKey);
    expect(props.onDeleteChannel).toBe(deleteChannel);
    expect(props.onLoadStoredVideos).toBe(loadStoredVideosForSelectedChannels);
    expect(props.onOpenNotes).toBe(openNotesModal);
    expect(props.onToggleChannelSelection).toBe(toggleChannelSelection);
    expect(props.onUpdateChannelMetadata).toBe(updateChannelMetadata);
  });

  it('forwards channel add, scan, and category edit handlers without renaming them', () => {
    const handleBulkAdd = () => 'bulk';
    const handlePreviewChannel = () => 'preview';
    const handleSaveChannel = () => 'save';
    const handleTagScan = () => 'scan';
    const startRenameCategory = () => 'rename';
    const toggleNewChannelTag = () => 'tag';

    const props = getLegacyChannelPanelProps({
      handleBulkAdd,
      handlePreviewChannel,
      handleSaveChannel,
      handleTagScan,
      startRenameCategory,
      toggleNewChannelTag,
    });

    expect(props.handleBulkAdd).toBe(handleBulkAdd);
    expect(props.handlePreviewChannel).toBe(handlePreviewChannel);
    expect(props.handleSaveChannel).toBe(handleSaveChannel);
    expect(props.handleTagScan).toBe(handleTagScan);
    expect(props.startRenameCategory).toBe(startRenameCategory);
    expect(props.toggleNewChannelTag).toBe(toggleNewChannelTag);
  });
});
