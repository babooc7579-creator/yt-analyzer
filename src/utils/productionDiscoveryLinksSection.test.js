import { describe, expect, it } from 'vitest';

import {
  getProductionDiscoveryLinkCardProps,
  getProductionDiscoveryLinkList,
  getProductionDiscoveryLinksSectionActions,
  getProductionDiscoveryLinksSectionHeaderProps,
} from './productionDiscoveryLinksSection';

describe('productionDiscoveryLinksSection utils', () => {
  it('normalizes production discovery link candidates for rendering', () => {
    const links = [{ id: 'link-1' }];

    expect(getProductionDiscoveryLinkList(links)).toEqual(links);
    expect(getProductionDiscoveryLinkList(null)).toEqual([]);
  });

  it('removes invalid discovery link entries before rendering cards', () => {
    const links = [{ id: 'link-1' }, null, undefined, 'bad', { id: 'link-2' }];

    expect(getProductionDiscoveryLinkList(links)).toEqual([
      { id: 'link-1' },
      { id: 'link-2' },
    ]);
  });

  it('builds card props with move state and forwarded handlers', () => {
    const link = { id: 'link-1', title: 'Reference' };
    const onOpenDiscoveryLinks = () => 'open';
    const onMoveLink = () => 'move';

    expect(getProductionDiscoveryLinkCardProps({
      link,
      linkMoveStates: { 'link-1': 'saving' },
      onMoveLink,
      onOpenDiscoveryLinks,
    })).toEqual({
      link,
      moveState: 'saving',
      onEditInDiscoveryLinks: onOpenDiscoveryLinks,
      onMove: onMoveLink,
    });
  });

  it('keeps the existing undefined move state when no state exists', () => {
    expect(getProductionDiscoveryLinkCardProps({
      link: { id: 'link-2' },
      linkMoveStates: null,
      onMoveLink: () => 'move',
      onOpenDiscoveryLinks: () => 'open',
    }).moveState).toBeUndefined();
  });

  it('uses safe card props when a discovery link candidate is missing', () => {
    expect(getProductionDiscoveryLinkCardProps({
      link: null,
      linkMoveStates: { 'link-1': 'saving' },
      onMoveLink: () => 'move',
      onOpenDiscoveryLinks: () => 'open',
    })).toMatchObject({
      link: {},
      moveState: undefined,
    });
  });

  it('builds discovery link management copy as a stored Cloud lookup without external collection', () => {
    const onOpenDiscoveryLinks = () => 'open discovery links';

    const { openDiscoveryLinksButtonProps } = getProductionDiscoveryLinksSectionActions({
      onOpenDiscoveryLinks,
    });

    expect(openDiscoveryLinksButtonProps.onClick).toBe(onOpenDiscoveryLinks);
    expect(openDiscoveryLinksButtonProps.title).toContain('Cloud 발견함에 저장된 링크 후보');
    expect(openDiscoveryLinksButtonProps.title).toContain('외부 사이트 자동 수집');
    expect(openDiscoveryLinksButtonProps.title).toContain('다운로드는 실행하지 않습니다');
    expect(openDiscoveryLinksButtonProps['aria-label']).toContain('Cloud 저장 링크 조회와 수정');
    expect(openDiscoveryLinksButtonProps['aria-label']).toContain('외부 자동 수집 없음');
  });

  it('explains discovery link candidates as Cloud discovery records, not a separate production DB', () => {
    const headerProps = getProductionDiscoveryLinksSectionHeaderProps({ linkCount: 3 });

    expect(headerProps.badgeText).toBe('링크 후보 3개');
    expect(headerProps.badgeTitle).toContain('영상 후보와 별도');
    expect(headerProps.eyebrow).toBe('발견함 링크 후보');
    expect(headerProps.title).toBe('외부에서 저장한 제작 후보 링크');
    expect(headerProps.description).toContain('Cloud 발견함 기록');
    expect(headerProps.description).toContain('제작 참고 목록');
    expect(headerProps.description).toContain('별도 제작 DB');
    expect(headerProps.description).toContain('자동 수집이나 다운로드는 실행하지 않습니다');
    expect(headerProps.openButtonLabel).toBe('발견함 열기');
  });
});
