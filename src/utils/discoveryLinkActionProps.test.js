import { describe, expect, it, vi } from 'vitest';

import {
  getDiscoveryLinkCandidateActionProps,
  getDiscoveryLinkUtilityActionProps,
} from './discoveryLinkActionProps';

describe('discoveryLinkActionProps utils', () => {
  it('builds candidate action copy that separates candidate status from rights clearance', () => {
    const onSendToCandidate = vi.fn();
    const props = getDiscoveryLinkCandidateActionProps({
      currentStatus: 'inbox',
      onSendToCandidate,
      saving: false,
      title: 'Idea link',
    });

    expect(props.isCandidate).toBe(false);
    expect(props.label).toBe('제작 후보로');
    expect(props.buttonProps.disabled).toBe(false);
    expect(props.buttonProps.onClick).toBe(onSendToCandidate);
    expect(props.buttonProps.title).toContain('권리 확인 완료를 의미하지');
    expect(props.buttonProps.title).toContain('외부 사이트를 새로 수집하지 않습니다');
    expect(props.buttonProps['aria-label']).toContain('Cloud 발견함 기록');
  });

  it('disables already-candidate discovery links', () => {
    const props = getDiscoveryLinkCandidateActionProps({
      currentStatus: 'candidate',
      saving: false,
      title: 'Idea link',
    });

    expect(props.isCandidate).toBe(true);
    expect(props.label).toBe('후보 등록됨');
    expect(props.buttonProps.disabled).toBe(true);
    expect(props.buttonProps.title).toContain('권리 확인 상태는 별도로 확인');
  });

  it('builds utility actions for open, copy, edit, and delete without external collection', () => {
    const onDelete = vi.fn();
    const onToggleEdit = vi.fn();
    const props = getDiscoveryLinkUtilityActionProps({
      isEditing: false,
      link: { url: 'https://example.com/post' },
      onDelete,
      onToggleEdit,
      saving: false,
      title: 'Idea link',
    });

    expect(props.openLinkProps.href).toBe('https://example.com/post');
    expect(props.openLinkProps.title).toContain('자동 수집하거나 다운로드하지 않습니다');
    expect(props.openLinkLabel).toBe('열기');
    expect(props.copyUrlButtonProps.title).toContain('외부 사이트 수집이나 저장 작업은 없습니다');
    expect(props.editButtonLabel).toBe('수정');
    expect(props.editIconName).toBe('edit');
    expect(props.editButtonProps.onClick).toBe(onToggleEdit);
    expect(props.deleteButtonProps.onClick).toBe(onDelete);
    expect(props.deleteButtonProps.title).toContain('원본 사이트는 삭제되지 않습니다');
    expect(props.deleteButtonProps['aria-label']).toContain('원본 사이트는 삭제하지 않음');
  });

  it('switches edit copy and disables utility actions while saving', () => {
    const props = getDiscoveryLinkUtilityActionProps({
      isEditing: true,
      link: { url: 'https://example.com/post' },
      saving: true,
      title: 'Idea link',
    });

    expect(props.copyUrlButtonProps.disabled).toBe(true);
    expect(props.editButtonProps.disabled).toBe(true);
    expect(props.deleteButtonProps.disabled).toBe(true);
    expect(props.editButtonLabel).toBe('닫기');
    expect(props.editIconName).toBe('close');
    expect(props.editButtonProps.title).toContain('저장하지 않은 입력은 적용되지 않습니다');
  });

  it('uses safe title and link fallbacks', () => {
    const props = getDiscoveryLinkUtilityActionProps();

    expect(props.openLinkProps['aria-label']).toContain('발견 링크');
    expect(props.copyUrlButtonProps.url).toBeUndefined();
  });
});
