import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  getDiscoveryLinkFilterModelMock,
  getDiscoveryLinksRouteContextMock,
  stateSetters,
  stateValueOverrides,
} = vi.hoisted(() => ({
  getDiscoveryLinkFilterModelMock: vi.fn(() => ({
    filteredDiscoveryLinkUrlList: '1. Saved URL',
    filteredLinks: [{ id: 'link-1' }],
    hasActiveDiscoveryFilters: false,
    rightsFilterOptions: [{ value: 'all', count: 1 }],
    statusFilterOptions: [{ value: 'all', count: 1 }],
  })),
  getDiscoveryLinksRouteContextMock: vi.fn(() => null),
  stateSetters: [],
  stateValueOverrides: [],
}));

vi.mock('react', () => ({
  useMemo: vi.fn((factory) => factory()),
  useState: vi.fn((initialValue) => {
    const setter = vi.fn();
    stateSetters.push(setter);

    const value = stateValueOverrides.length
      ? stateValueOverrides.shift()
      : (typeof initialValue === 'function' ? initialValue() : initialValue);

    return [value, setter];
  }),
}));

vi.mock('../utils/discoveryLinkFilters', () => ({
  getDiscoveryLinkFilterModel: getDiscoveryLinkFilterModelMock,
  getDiscoveryLinksRouteContext: getDiscoveryLinksRouteContextMock,
}));

import { useMemo, useState } from 'react';
import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
} from '../constants/discoveryLinks';
import {
  getDiscoveryLinkFilterModel,
  getDiscoveryLinksRouteContext,
} from '../utils/discoveryLinkFilters';
import { useDiscoveryLinkFilters } from './useDiscoveryLinkFilters';

const setStateValues = (...values) => {
  stateValueOverrides.push(...values);
};

describe('useDiscoveryLinkFilters', () => {
  beforeEach(() => {
    stateSetters.length = 0;
    stateValueOverrides.length = 0;
    vi.clearAllMocks();
  });

  it('initializes filters with all-status defaults and passes them to the filter model', () => {
    const links = [{ id: 'link-1' }];
    const filters = useDiscoveryLinkFilters(links);

    expect(useState).toHaveBeenNthCalledWith(1, ALL_DISCOVERY_LINK_STATUS_OPTION.value);
    expect(useState).toHaveBeenNthCalledWith(2, ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value);
    expect(useState).toHaveBeenNthCalledWith(3, expect.any(Function));
    expect(useState).toHaveBeenNthCalledWith(4, expect.any(Function));
    expect(getDiscoveryLinkFilterModel).toHaveBeenCalledWith({
      links,
      rightsFilter: ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
      searchQuery: '',
      statusFilter: ALL_DISCOVERY_LINK_STATUS_OPTION.value,
      targetDiscoveryLinkId: '',
    });
    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [
      links,
      ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
      '',
      ALL_DISCOVERY_LINK_STATUS_OPTION.value,
      '',
    ]);
    expect(getDiscoveryLinksRouteContext).toHaveBeenCalledWith({
      searchQuery: '',
      source: '',
      targetDiscoveryLinkId: '',
    });
    expect(filters).toMatchObject({
      filteredDiscoveryLinkUrlList: '1. Saved URL',
      filteredLinks: [{ id: 'link-1' }],
      hasActiveDiscoveryFilters: false,
      rightsFilter: ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
      searchQuery: '',
      statusFilter: ALL_DISCOVERY_LINK_STATUS_OPTION.value,
    });
  });

  it('exposes active filter state and the underlying state setters', () => {
    setStateValues('candidate', 'needs_check', 'cake', 'link-1');

    const filters = useDiscoveryLinkFilters([{ id: 'candidate-link' }]);

    expect(filters.statusFilter).toBe('candidate');
    expect(filters.rightsFilter).toBe('needs_check');
    expect(filters.searchQuery).toBe('cake');
    filters.setStatusFilter('saved');
    filters.setRightsFilter('cleared');
    filters.setSearchQuery('new search');
    expect(stateSetters[0]).toHaveBeenCalledWith('saved');
    expect(stateSetters[1]).toHaveBeenCalledWith('cleared');
    expect(stateSetters[2]).toHaveBeenCalledWith('new search');
    expect(stateSetters[3]).toHaveBeenCalledTimes(3);
    expect(stateSetters[3]).toHaveBeenCalledWith('');
    expect(getDiscoveryLinkFilterModel).toHaveBeenCalledWith({
      links: [{ id: 'candidate-link' }],
      rightsFilter: 'needs_check',
      searchQuery: 'cake',
      statusFilter: 'candidate',
      targetDiscoveryLinkId: 'link-1',
    });
  });

  it('clears discovery filters back to safe all-status defaults without touching data', () => {
    setStateValues('candidate', 'do_not_use', 'instagram', 'risky-link');

    const filters = useDiscoveryLinkFilters([{ id: 'risky-link' }]);
    filters.clearDiscoveryFilters();

    expect(stateSetters[0]).toHaveBeenCalledWith(ALL_DISCOVERY_LINK_STATUS_OPTION.value);
    expect(stateSetters[1]).toHaveBeenCalledWith(ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value);
    expect(stateSetters[2]).toHaveBeenCalledWith('');
    expect(stateSetters[3]).toHaveBeenCalledWith('');
  });

  it('starts from an exact production-candidate link intent', () => {
    getDiscoveryLinksRouteContextMock.mockReturnValueOnce({
      label: '제작 후보함에서 이어온 링크',
    });

    const filters = useDiscoveryLinkFilters([{ id: 'link-1' }], {
      initialSearchQuery: 'Reference',
      initialSearchSource: 'studio-candidates',
      initialTargetDiscoveryLinkId: 'link-1',
    });

    expect(filters.searchQuery).toBe('Reference');
    expect(filters.targetDiscoveryLinkId).toBe('link-1');
    expect(filters.routeContext).toEqual({ label: '제작 후보함에서 이어온 링크' });
    expect(getDiscoveryLinksRouteContext).toHaveBeenCalledWith({
      searchQuery: 'Reference',
      source: 'studio-candidates',
      targetDiscoveryLinkId: 'link-1',
    });
  });
});
