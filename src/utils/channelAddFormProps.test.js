import { describe, expect, it, vi } from 'vitest';

import { getChannelAddFormViewProps } from './channelAddFormProps';

const createInput = (overrides = {}) => ({
  addMode: 'single',
  setAddMode: vi.fn(),
  bulkInput: 'https://youtube.com/@a',
  setBulkInput: vi.fn(),
  bulkLoading: false,
  bulkResult: { ok: 1 },
  resetBulkAdd: vi.fn(),
  handleBulkAdd: vi.fn(),
  categories: ['해외', '정치'],
  setCategories: vi.fn(),
  newCategoryName: '뉴스',
  setNewCategoryName: vi.fn(),
  isEditingCategory: false,
  setIsEditingCategory: vi.fn(),
  renamingCategory: null,
  renameValue: '',
  setRenameValue: vi.fn(),
  renameLoading: false,
  startRenameCategory: vi.fn(),
  confirmRenameCategory: vi.fn(),
  cancelRenameCategory: vi.fn(),
  newChannelInput: '@peakviral',
  setNewChannelInput: vi.fn(),
  newChannelTags: ['해외'],
  toggleNewChannelTag: vi.fn(),
  newChannelLang: 'EN',
  setNewChannelLang: vi.fn(),
  newChannelNote: 'check source',
  setNewChannelNote: vi.fn(),
  channelPreview: { id: 'channel-1' },
  previewLoading: false,
  handlePreviewChannel: vi.fn(),
  cancelChannelPreview: vi.fn(),
  handleSaveChannel: vi.fn(),
  loading: false,
  ...overrides,
});

describe('channelAddFormProps utils', () => {
  it('groups header and category settings props without changing references', () => {
    const input = createInput({
      cloudOnlyTags: ['Cloud only'],
      isEditingCategory: true,
      renameLoading: true,
    });

    const props = getChannelAddFormViewProps(input);

    expect(props.headerProps).toMatchObject({
      addMode: 'single',
      channelPreview: input.channelPreview,
      isEditingCategory: true,
      setAddMode: input.setAddMode,
      setIsEditingCategory: input.setIsEditingCategory,
    });
    expect(props.categorySettingsProps).toMatchObject({
      cancelRenameCategory: input.cancelRenameCategory,
      categories: input.categories,
      cloudOnlyTags: ['Cloud only'],
      confirmRenameCategory: input.confirmRenameCategory,
      newCategoryName: '뉴스',
      renameLoading: true,
      renameValue: '',
      renamingCategory: null,
      setCategories: input.setCategories,
      setNewCategoryName: input.setNewCategoryName,
      setRenameValue: input.setRenameValue,
      startRenameCategory: input.startRenameCategory,
    });
  });

  it('passes single channel add state and handlers to singleAddFormProps', () => {
    const input = createInput({
      loading: true,
      previewLoading: true,
    });

    const props = getChannelAddFormViewProps(input);

    expect(props.singleAddFormProps).toMatchObject({
      cancelChannelPreview: input.cancelChannelPreview,
      categories: input.categories,
      channelPreview: input.channelPreview,
      handlePreviewChannel: input.handlePreviewChannel,
      handleSaveChannel: input.handleSaveChannel,
      loading: true,
      newChannelInput: '@peakviral',
      newChannelLang: 'EN',
      newChannelNote: 'check source',
      newChannelTags: ['해외'],
      previewLoading: true,
      setNewChannelInput: input.setNewChannelInput,
      setNewChannelLang: input.setNewChannelLang,
      setNewChannelNote: input.setNewChannelNote,
      toggleNewChannelTag: input.toggleNewChannelTag,
    });
  });

  it('passes bulk add state and shared tag fields to bulkAddFormProps', () => {
    const input = createInput({
      addMode: 'bulk',
      bulkLoading: true,
      cloudOnlyTags: undefined,
    });

    const props = getChannelAddFormViewProps(input);

    expect(props.bulkAddFormProps).toMatchObject({
      bulkInput: 'https://youtube.com/@a',
      bulkLoading: true,
      bulkResult: { ok: 1 },
      categories: input.categories,
      handleBulkAdd: input.handleBulkAdd,
      newChannelLang: 'EN',
      newChannelTags: ['해외'],
      resetBulkAdd: input.resetBulkAdd,
      setBulkInput: input.setBulkInput,
      setNewChannelLang: input.setNewChannelLang,
      toggleNewChannelTag: input.toggleNewChannelTag,
    });
    expect(props.categorySettingsProps.cloudOnlyTags).toEqual([]);
  });
});
