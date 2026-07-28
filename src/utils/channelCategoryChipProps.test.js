import { describe, expect, it, vi } from 'vitest';

import { getChannelCategoryChipViewProps } from './channelCategoryChipProps';

const createProps = (overrides = {}) => getChannelCategoryChipViewProps({
  cancelRenameCategory: vi.fn(),
  category: '해외',
  confirmRenameCategory: vi.fn(),
  hideCategoryFromLocalList: vi.fn(),
  renameLoading: false,
  renameValue: '해외',
  setRenameValue: vi.fn(),
  startRenameCategory: vi.fn(),
  ...overrides,
});

describe('channelCategoryChipProps utils', () => {
  it('builds hide button props that explain local-only hiding', () => {
    const hideCategoryFromLocalList = vi.fn();
    const props = createProps({ hideCategoryFromLocalList });

    expect(props.hideButtonProps).toMatchObject({
      title: '화면 목록에서만 숨깁니다. 이미 채널에 붙은 온라인 저장소(Azure DB)의 채널 태그는 삭제되지 않습니다.',
      'aria-label': '해외 카테고리를 화면 목록에서만 숨기기',
      type: 'button',
    });

    props.hideButtonProps.onClick();

    expect(hideCategoryFromLocalList).toHaveBeenCalledWith('해외');
  });

  it('builds rename action props with Cloud tag wording', () => {
    const startRenameCategory = vi.fn();
    const confirmRenameCategory = vi.fn();
    const cancelRenameCategory = vi.fn();
    const props = createProps({
      cancelRenameCategory,
      confirmRenameCategory,
      renameLoading: true,
      startRenameCategory,
    });

    expect(props.startRenameButtonProps.title).toBe('온라인 저장소(Azure DB)의 채널 태그 이름 변경 - 이 태그가 붙은 모든 채널에 일괄 반영됩니다');
    expect(props.startRenameButtonProps['aria-label']).toBe('해외 온라인 저장소(Azure DB)의 채널 태그 이름 변경');
    expect(props.confirmButtonProps).toMatchObject({
      disabled: true,
      title: '온라인 저장소(Azure DB)의 채널 태그 이름 변경 저장',
      'aria-label': '해외 온라인 저장소(Azure DB)의 채널 태그 이름 변경 저장',
      type: 'button',
    });
    expect(props.cancelButtonProps).toMatchObject({
      title: '태그 이름 변경 취소',
      'aria-label': '해외 태그 이름 변경 취소',
      type: 'button',
    });

    props.startRenameButtonProps.onClick();
    props.confirmButtonProps.onClick();
    props.cancelButtonProps.onClick();

    expect(startRenameCategory).toHaveBeenCalledWith('해외');
    expect(confirmRenameCategory).toHaveBeenCalledTimes(1);
    expect(cancelRenameCategory).toHaveBeenCalledTimes(1);
  });

  it('builds rename input props for change, enter, and escape actions', () => {
    const setRenameValue = vi.fn();
    const confirmRenameCategory = vi.fn();
    const cancelRenameCategory = vi.fn();
    const props = createProps({
      cancelRenameCategory,
      confirmRenameCategory,
      renameValue: '새 해외',
      setRenameValue,
    });

    expect(props.renameInputProps).toMatchObject({
      autoFocus: true,
      title: '변경할 온라인 저장소(Azure DB)의 채널 태그 이름 입력',
      'aria-label': '해외 온라인 저장소(Azure DB)의 채널 태그 새 이름',
      type: 'text',
      value: '새 해외',
    });

    props.renameInputProps.onChange({
      target: {
        value: '월드',
      },
    });
    props.renameInputProps.onKeyDown({ key: 'Enter' });
    props.renameInputProps.onKeyDown({ key: 'Escape' });
    props.renameInputProps.onKeyDown({ key: 'Tab' });

    expect(setRenameValue).toHaveBeenCalledWith('월드');
    expect(confirmRenameCategory).toHaveBeenCalledTimes(1);
    expect(cancelRenameCategory).toHaveBeenCalledTimes(1);
  });
});
