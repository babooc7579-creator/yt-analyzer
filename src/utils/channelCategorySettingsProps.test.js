import { describe, expect, it, vi } from 'vitest';

import {
  canAddCategoryToLocalList,
  getCategoriesAfterLocalAdd,
  getCategoriesAfterLocalHide,
  getCategoryHideConfirmMessage,
  getChannelCategoryAddInputViewProps,
  getChannelCategoryList,
  getChannelCategorySettingsProps,
  getChannelCloudOnlyTagsNoticeViewProps,
} from './channelCategorySettingsProps';

describe('channelCategorySettingsProps utils', () => {
  it('normalizes category lists and builds local hide confirmation copy', () => {
    expect(getChannelCategoryList(['해외', '예능'])).toEqual(['해외', '예능']);
    expect(getChannelCategoryList(null)).toEqual([]);

    const message = getCategoryHideConfirmMessage('해외');
    expect(message).toContain("'해외' 카테고리를 화면 목록에서 숨길까요?");
    expect(message).toContain('Cloud 태그는 삭제되지 않습니다');
  });

  it('calculates local category hide and add results without Cloud changes', () => {
    const categories = ['해외', '예능'];

    expect(getCategoriesAfterLocalHide(categories, '해외')).toEqual(['예능']);
    expect(getCategoriesAfterLocalHide(null, '해외')).toEqual([]);
    expect(canAddCategoryToLocalList(categories, '미분류')).toBe(true);
    expect(canAddCategoryToLocalList(categories, '해외')).toBe(false);
    expect(canAddCategoryToLocalList(categories, '')).toBe(false);
    expect(getCategoriesAfterLocalAdd(categories, '미분류')).toEqual(['해외', '예능', '미분류']);
    expect(getCategoriesAfterLocalAdd(categories, '해외')).toEqual(categories);
  });

  it('builds category settings child props with forwarded handlers', () => {
    const props = {
      addCategoryToLocalList: vi.fn(),
      cancelRenameCategory: vi.fn(),
      categories: ['해외'],
      cloudOnlyTags: ['Cloud only'],
      confirmRenameCategory: vi.fn(),
      hideCategoryFromLocalList: vi.fn(),
      newCategoryName: '예능',
      renameLoading: true,
      renameValue: '해외2',
      renamingCategory: '해외',
      setNewCategoryName: vi.fn(),
      setRenameValue: vi.fn(),
      startRenameCategory: vi.fn(),
    };

    expect(getChannelCategorySettingsProps(props)).toMatchObject({
      addInputProps: {
        newCategoryName: '예능',
        onAddCategory: props.addCategoryToLocalList,
        setNewCategoryName: props.setNewCategoryName,
      },
      chipListProps: {
        cancelRenameCategory: props.cancelRenameCategory,
        categories: ['해외'],
        confirmRenameCategory: props.confirmRenameCategory,
        hideCategoryFromLocalList: props.hideCategoryFromLocalList,
        renameLoading: true,
        renameValue: '해외2',
        renamingCategory: '해외',
        setRenameValue: props.setRenameValue,
        startRenameCategory: props.startRenameCategory,
      },
      cloudOnlyTagsNoticeProps: {
        cloudOnlyTags: ['Cloud only'],
      },
      categoryList: ['해외'],
    });
  });

  it('builds category add input copy for local screen categories', () => {
    const props = getChannelCategoryAddInputViewProps();

    expect(props).toEqual({
      addButtonProps: {
        'aria-label': '화면 카테고리 추가',
        title: '화면 카테고리 추가',
      },
      inputAriaLabel: '새 화면 카테고리 이름',
      inputPlaceholder: '새 카테고리명',
    });
  });

  it('builds Cloud-only tag notice copy without implying tag deletion', () => {
    expect(getChannelCloudOnlyTagsNoticeViewProps([])).toBeNull();

    const props = getChannelCloudOnlyTagsNoticeViewProps([
      '해외',
      '예능',
      '정치',
      '역사',
      '미분류',
    ]);

    expect(props.title).toContain('Cloud에는 있지만');
    expect(props.tagSummary).toBe('해외, 예능, 정치, 역사 외 1개');
    expect(props.description).toContain('Cloud 채널 태그는 삭제되지 않습니다');
  });
});
