import { describe, expect, it } from 'vitest';

import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
} from '../constants/discoveryLinks';
import {
  buildDiscoveryLinkFilterOptions,
  getDiscoveryLinkFilterModel,
  normalizeDiscoveryLinkSearchQuery,
} from './discoveryLinkFilters';

describe('discoveryLinkFilters utils', () => {
  const links = [
    {
      id: 'ig-candidate',
      title: 'Cake Table Reference',
      url: 'https://www.instagram.com/reel/cake',
      memo: 'Army style table',
      status: 'candidate',
      rightsStatus: 'needs_check',
    },
    {
      id: 'yt-saved',
      title: 'Workshop Clip',
      url: 'https://youtu.be/workshop',
      memo: 'safe source',
      status: 'saved',
      rightsStatus: 'cleared',
    },
    {
      id: 'web-reviewing',
      title: 'Wood Design Notes',
      url: 'https://example.com/wood',
      memo: 'needs more review',
      status: 'reviewing',
      rightsStatus: 'unknown',
    },
  ];

  it('normalizes discovery link search text', () => {
    expect(normalizeDiscoveryLinkSearchQuery('  Cake IDEA  ')).toBe('cake idea');
    expect(normalizeDiscoveryLinkSearchQuery()).toBe('');
    expect(normalizeDiscoveryLinkSearchQuery(null)).toBe('');
  });

  it('builds status and rights filter option counts', () => {
    const { rightsFilterOptions, statusFilterOptions } = buildDiscoveryLinkFilterOptions({
      linkCount: 3,
      rightsCounts: {
        cleared: 1,
        needs_check: 1,
        unknown: 1,
      },
      statusCounts: {
        candidate: 1,
        reviewing: 1,
        saved: 1,
      },
    });

    expect(statusFilterOptions[0]).toMatchObject({
      count: 3,
      value: ALL_DISCOVERY_LINK_STATUS_OPTION.value,
    });
    expect(statusFilterOptions.find(option => option.value === 'candidate')).toMatchObject({ count: 1 });
    expect(rightsFilterOptions[0]).toMatchObject({
      count: 3,
      value: ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
    });
    expect(rightsFilterOptions.find(option => option.value === 'needs_check')).toMatchObject({ count: 1 });
  });

  it('filters links by status, rights status, and search query in one model', () => {
    const model = getDiscoveryLinkFilterModel({
      links,
      rightsFilter: 'needs_check',
      searchQuery: 'army',
      statusFilter: 'candidate',
    });

    expect(model.filteredLinks.map(link => link.id)).toEqual(['ig-candidate']);
    expect(model.filteredDiscoveryLinkUrlList).toContain('1. Cake Table Reference');
    expect(model.filteredDiscoveryLinkUrlList).toContain('https://www.instagram.com/reel/cake');
    expect(model.hasActiveDiscoveryFilters).toBe(true);
  });

  it('keeps all links and inactive state when every filter is cleared', () => {
    const model = getDiscoveryLinkFilterModel({
      links,
      rightsFilter: ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
      searchQuery: '   ',
      statusFilter: ALL_DISCOVERY_LINK_STATUS_OPTION.value,
    });

    expect(model.filteredLinks.map(link => link.id)).toEqual([
      'ig-candidate',
      'yt-saved',
      'web-reviewing',
    ]);
    expect(model.hasActiveDiscoveryFilters).toBe(false);
    expect(model.statusFilterOptions[0].count).toBe(3);
    expect(model.rightsFilterOptions[0].count).toBe(3);
  });

  it('uses safe empty output when links are not an array', () => {
    const model = getDiscoveryLinkFilterModel({
      links: null,
      rightsFilter: 'needs_check',
      searchQuery: 'cake',
      statusFilter: 'candidate',
    });

    expect(model.filteredDiscoveryLinkUrlList).toBe('');
    expect(model.filteredLinks).toEqual([]);
    expect(model.statusFilterOptions[0].count).toBe(0);
    expect(model.rightsFilterOptions[0].count).toBe(0);
  });
});
