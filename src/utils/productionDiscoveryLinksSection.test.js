import { describe, expect, it } from 'vitest';

import {
  getProductionDiscoveryLinkCardProps,
  getProductionDiscoveryLinkList,
  getProductionDiscoveryLinksSectionActions,
} from './productionDiscoveryLinksSection';

describe('productionDiscoveryLinksSection utils', () => {
  it('normalizes production discovery link candidates for rendering', () => {
    const links = [{ id: 'link-1' }];

    expect(getProductionDiscoveryLinkList(links)).toBe(links);
    expect(getProductionDiscoveryLinkList(null)).toEqual([]);
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
});
