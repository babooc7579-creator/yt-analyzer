import { describe, expect, it, vi } from 'vitest';

import {
  getChannelTagSelectorButtonProps,
  getChannelTagSelectorViewProps,
} from './channelTagSelectorProps';

describe('channelTagSelectorProps utils', () => {
  it('builds selected tag button props with no API or Cloud save wording', () => {
    const toggleTag = vi.fn();
    const props = getChannelTagSelectorButtonProps({
      category: '해외',
      isSelected: true,
      toggleTag,
    });

    expect(props.className).toContain('bg-indigo-600');
    expect(props.title).toContain('해외 태그 선택 해제');
    expect(props.title).toContain('YouTube API 호출이나 Cloud 저장은 실행되지 않습니다');
    expect(props['aria-label']).toBe(props.title);
    expect(props.type).toBe('button');

    props.onClick();

    expect(toggleTag).toHaveBeenCalledWith('해외');
  });

  it('builds unselected tag button props', () => {
    const props = getChannelTagSelectorButtonProps({
      category: '정치',
      isSelected: false,
      toggleTag: vi.fn(),
    });

    expect(props.className).toContain('bg-white');
    expect(props.className).toContain('hover:border-indigo-300');
    expect(props.title).toContain('정치 태그 선택');
    expect(props.title).toContain('YouTube API 호출이나 Cloud 저장은 실행되지 않습니다');
  });

  it('maps categories to tag button props and ignores non-array input', () => {
    const toggleTag = vi.fn();
    const props = getChannelTagSelectorViewProps({
      categories: ['해외', '정치'],
      selectedTags: ['정치'],
      toggleTag,
    });

    expect(props.tagButtons).toHaveLength(2);
    expect(props.tagButtons[0]).toMatchObject({
      category: '해외',
    });
    expect(props.tagButtons[0].buttonProps.title).toContain('선택 -');
    expect(props.tagButtons[1].buttonProps.title).toContain('선택 해제');

    expect(getChannelTagSelectorViewProps({
      categories: null,
      selectedTags: '정치',
      toggleTag,
    })).toEqual({
      tagButtons: [],
    });
  });
});
