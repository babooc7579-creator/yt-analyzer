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
    expect(props.buttonProps.title).not.toBe('');
    expect(props.buttonProps['aria-label']).toContain('First idea');
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
});
