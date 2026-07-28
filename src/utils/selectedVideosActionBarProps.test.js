import { describe, expect, it } from 'vitest';

import { getSelectedVideosActionBarViewProps } from './selectedVideosActionBarProps';

describe('selectedVideosActionBarProps utils', () => {
  it('returns null when there are no selected videos', () => {
    expect(getSelectedVideosActionBarViewProps({ selectedCount: 0 })).toBeNull();
  });

  it('builds default prompt copy action without implying an AI API call', () => {
    const props = getSelectedVideosActionBarViewProps({ selectedCount: 3 });

    expect(props).toMatchObject({
      buttonLabel: 'AI 요청문 복사',
      iconName: 'copy',
      selectedCountText: '3',
      selectedSuffixText: '개 선택됨',
      selectedText: '3개 선택됨',
    });
    expect(props.helpText).toContain('AI API를 호출하지 않고');
    expect(props.buttonProps.title).toContain('AI API를 호출하지 않고');
    expect(props.buttonProps['aria-label']).toBe('선택 영상 3개: AI 요청문 복사');
    expect(props.clearButtonLabel).toBe('선택 해제');
    expect(props.clearButtonProps['aria-label']).toBe('선택 영상 3개 모두 해제, API 호출 없음');
    expect(props.clearButtonProps.title).toContain('저장된 영상 정보는 바뀌지 않습니다');
  });

  it('switches copy action copy for copied and browser-blocked states', () => {
    expect(getSelectedVideosActionBarViewProps({
      copiedPrompt: true,
      selectedCount: 2,
    })).toMatchObject({
      buttonLabel: '복사 완료! AI에게 붙여넣으세요',
      iconName: 'check',
    });

    const errorProps = getSelectedVideosActionBarViewProps({
      promptCopyError: true,
      selectedCount: 2,
    });

    expect(errorProps).toMatchObject({
      buttonLabel: '복사 실패 - 다시 시도',
      iconName: 'alert',
    });
    expect(errorProps.helpText).toContain('브라우저가 클립보드 복사를 막았습니다');
  });
});
