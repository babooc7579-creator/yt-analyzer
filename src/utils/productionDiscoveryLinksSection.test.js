import { describe, expect, it } from 'vitest';

import {
  getProductionDiscoveryLinkCardProps,
  getProductionDiscoveryLinkList,
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
});
