import { describe, expect, it, vi } from 'vitest';

import { getVideoListRowCandidateActionViewProps } from './videoListRowCandidateActionProps';

describe('videoListRowCandidateActionProps utils', () => {
  it('builds an enabled production candidate button for non-candidate videos', () => {
    const onPromote = vi.fn();

    const props = getVideoListRowCandidateActionViewProps({
      isProductionCandidate: false,
      onPromote,
      videoTitle: 'First idea',
    });

    expect(props.buttonLabel).not.toBe('');
    expect(props.buttonProps).toMatchObject({
      disabled: false,
      onClick: onPromote,
      type: 'button',
    });
    expect(props.buttonProps.className).toContain('bg-indigo-600');
    expect(props.buttonProps.title).toContain('Cloud 판단 기록');
    expect(props.buttonProps.title).toContain('YouTube API를 새로 호출하지 않습니다');
    expect(props.buttonProps['aria-label']).toContain('First idea');
    expect(props.buttonProps['aria-label']).toContain('YouTube API 호출 없음');
  });

  it('builds a disabled button for videos already in production candidates', () => {
    const props = getVideoListRowCandidateActionViewProps({
      isProductionCandidate: true,
      onPromote: () => {},
      videoTitle: 'First idea',
    });

    expect(props.buttonLabel).not.toBe('');
    expect(props.buttonProps.disabled).toBe(true);
    expect(props.buttonProps.className).toContain('cursor-not-allowed');
    expect(props.buttonProps.className).toContain('bg-indigo-100');
    expect(props.buttonProps['aria-label']).toContain('First idea');
    expect(props.buttonProps.title).toContain('이미 Cloud 판단 기록');
  });

  it('does not call the promote handler while building props', () => {
    const onPromote = vi.fn();

    getVideoListRowCandidateActionViewProps({
      isProductionCandidate: false,
      onPromote,
      videoTitle: 'First idea',
    });

    expect(onPromote).not.toHaveBeenCalled();
  });

  it('builds a disabled button when the row action is unavailable', () => {
    const onPromote = vi.fn();

    const props = getVideoListRowCandidateActionViewProps({
      disabled: true,
      isProductionCandidate: false,
      onPromote,
      videoTitle: 'No ID video',
    });

    expect(props.buttonProps.disabled).toBe(true);
    expect(props.buttonProps.className).toContain('cursor-not-allowed');
    expect(props.buttonProps.title).toBe('제작 후보로 저장할 영상 ID가 없어 Cloud 판단 기록 저장을 실행하지 않습니다.');
  });
});
