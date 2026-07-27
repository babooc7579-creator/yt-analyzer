import { describe, expect, it, vi } from 'vitest';

import {
  PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS,
  getProductionDiscoveryLinkBadgesViewProps,
  getProductionDiscoveryLinkCopyButtonProps,
  getProductionDiscoveryLinkEditButtonProps,
  getProductionDiscoveryLinkMoveActions,
  getProductionDiscoveryLinkMoveButtonViewProps,
  getProductionDiscoveryLinkMoveStatusViewProps,
  getProductionDiscoveryLinkOpenButtonProps,
} from './productionDiscoveryLinkActionProps';

describe('productionDiscoveryLinkActionProps utils', () => {
  it('builds production discovery link badge and moving button copy', () => {
    expect(getProductionDiscoveryLinkBadgesViewProps({ sourceHost: 'instagram.com' })).toEqual({
      candidateLabel: '링크 후보',
      sourceLabel: '출처 instagram.com',
    });
    expect(getProductionDiscoveryLinkMoveButtonViewProps({
      isMoving: true,
      label: '후보 제외',
    }).visibleLabel).toBe('온라인 저장소(Azure DB) 저장 중');
    expect(getProductionDiscoveryLinkMoveButtonViewProps({
      isMoving: false,
      label: '후보 제외',
    }).visibleLabel).toBe('후보 제외');
  });

  it('builds copy/open/edit button props without external collection or save work', () => {
    expect(getProductionDiscoveryLinkCopyButtonProps({
      disabled: true,
      link: { url: 'https://example.com/post' },
      linkTitle: 'Idea link',
    })).toMatchObject({
      ariaLabel: 'Idea link 원본 링크 URL 복사',
      copiedLabel: '복사 완료',
      copyingLabel: '복사 중',
      disabled: true,
      errorLabel: '복사 실패',
      label: '링크 복사',
      title: '원본 링크 URL을 클립보드에 복사합니다. 외부 사이트 수집이나 저장 작업은 없습니다.',
      url: 'https://example.com/post',
    });

    expect(getProductionDiscoveryLinkOpenButtonProps({
      link: { url: 'https://example.com/post' },
      linkTitle: 'Idea link',
    })).toEqual({
      'aria-label': 'Idea link 원본 링크 새 탭에서 열기, 외부 수집이나 저장 작업 없음',
      disabled: false,
      href: 'https://example.com/post',
      label: '원본 열기',
      title: '브라우저 새 탭에서 원본 URL만 엽니다. 외부 사이트 수집, 다운로드, 온라인 저장소(Azure DB) 저장 작업은 없습니다.',
    });

    expect(getProductionDiscoveryLinkEditButtonProps()).toEqual({
      'aria-label': '이 링크 발견함에서 수정',
      label: '발견함에서 수정',
      title: '발견함 화면에서 링크 상태와 메모를 수정합니다. Cloud 발견함 기록만 바꾸며 원본 사이트를 수집하지 않습니다.',
    });
  });

  it('disables the original-link open action when the URL is missing', () => {
    expect(getProductionDiscoveryLinkOpenButtonProps({
      link: {},
      linkTitle: 'Idea link',
    })).toEqual({
      'aria-label': 'Idea link 원본 링크 URL 없음',
      disabled: true,
      href: '#',
      label: '원본 열기',
      title: '원본 링크 URL이 없어 열 수 없습니다.',
    });
  });

  it('builds move actions that update Cloud discovery status without deleting link records', () => {
    const onMove = vi.fn();
    const actions = getProductionDiscoveryLinkMoveActions({
      link: { id: 'link-1' },
      linkTitle: 'Idea link',
      onMove,
    });

    expect(actions.map(action => action.targetStatus)).toEqual([
      PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS.INBOX,
      PRODUCTION_DISCOVERY_LINK_MOVE_TARGETS.DISCARDED,
    ]);
    expect(actions.every(action => action.disabled === false)).toBe(true);
    expect(actions[0].title).toContain('링크 기록은 삭제되지 않습니다');
    expect(actions[1].title).toContain('링크 기록을 삭제하지 않고');
    expect(onMove).not.toHaveBeenCalled();

    actions[0].onClick();
    actions[1].onClick();

    expect(onMove).toHaveBeenNthCalledWith(1, 'link-1', 'inbox');
    expect(onMove).toHaveBeenNthCalledWith(2, 'link-1', 'discarded');
  });

  it('disables move actions when the Cloud update target is missing', () => {
    const missingHandlerActions = getProductionDiscoveryLinkMoveActions({
      link: { id: 'link-1' },
      linkTitle: 'Idea link',
    });
    const missingIdMove = vi.fn();
    const missingIdActions = getProductionDiscoveryLinkMoveActions({
      link: {},
      linkTitle: 'Idea link',
      onMove: missingIdMove,
    });

    expect(missingHandlerActions.every(action => action.disabled)).toBe(true);
    expect(missingIdActions.every(action => action.disabled)).toBe(true);

    missingHandlerActions[0].onClick();
    missingIdActions[0].onClick();

    expect(missingIdMove).not.toHaveBeenCalled();
  });

  it('builds move status messages for saved, error, and idle states', () => {
    expect(getProductionDiscoveryLinkMoveStatusViewProps('saved')).toEqual({
      message: 'Cloud 발견함 상태 저장 완료. 제작 후보 표시만 갱신되고 링크 기록은 유지됩니다.',
      tone: 'success',
    });
    expect(getProductionDiscoveryLinkMoveStatusViewProps('error')).toEqual({
      message: 'Cloud 상태 저장 실패. 저장 완료 처리하지 않았습니다. 다시 눌러 주세요.',
      tone: 'danger',
    });
    expect(getProductionDiscoveryLinkMoveStatusViewProps('saving')).toBeNull();
  });
});
