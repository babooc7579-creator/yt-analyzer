import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getDiscoveryLinkFilterModelMock, stateSetters, stateValueOverrides } = vi.hoisted(() => ({
  getDiscoveryLinkFilterModelMock: vi.fn(() => ({
    filteredDiscoveryLinkUrlList: '1. Saved URL',
    filteredLinks: [{ id: 'link-1' }],
    hasActiveDiscoveryFilters: false,
    rightsFilterOptions: [{ value: 'all', count: 1 }],
    statusFilterOptions: [{ value: 'all', count: 1 }],
  })),
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
      : initialValue;

    return [value, setter];
  }),
}));

vi.mock('../utils/discoveryLinkFilters', () => ({
  getDiscoveryLinkFilterModel: getDiscoveryLinkFilterModelMock,
}));

import { useMemo, useState } from 'react';
import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
} from '../constants/discoveryLinks';
import { getDiscoveryLinkFilterModel } from '../utils/discoveryLinkFilters';
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
    expect(useState).toHaveBeenNthCalledWith(3, '');
    expect(getDiscoveryLinkFilterModel).toHaveBeenCalledWith({
      links,
      rightsFilter: ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
      searchQuery: '',
      statusFilter: ALL_DISCOVERY_LINK_STATUS_OPTION.value,
    });
    expect(useMemo).toHaveBeenCalledWith(expect.any(Function), [
      links,
      ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value,
      '',
      ALL_DISCOVERY_LINK_STATUS_OPTION.value,
    ]);
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
    setStateValues('candidate', 'needs_check', 'cake');

    const filters = useDiscoveryLinkFilters([{ id: 'candidate-link' }]);

    expect(filters.statusFilter).toBe('candidate');
    expect(filters.rightsFilter).toBe('needs_check');
    expect(filters.searchQuery).toBe('cake');
    expect(filters.setStatusFilter).toBe(stateSetters[0]);
    expect(filters.setRightsFilter).toBe(stateSetters[1]);
    expect(filters.setSearchQuery).toBe(stateSetters[2]);
    expect(getDiscoveryLinkFilterModel).toHaveBeenCalledWith({
      links: [{ id: 'candidate-link' }],
      rightsFilter: 'needs_check',
      searchQuery: 'cake',
      statusFilter: 'candidate',
    });
  });

  it('clears discovery filters back to safe all-status defaults without touching data', () => {
    setStateValues('candidate', 'do_not_use', 'instagram');

    const filters = useDiscoveryLinkFilters([{ id: 'risky-link' }]);
    filters.clearDiscoveryFilters();

    expect(stateSetters[0]).toHaveBeenCalledWith(ALL_DISCOVERY_LINK_STATUS_OPTION.value);
    expect(stateSetters[1]).toHaveBeenCalledWith(ALL_DISCOVERY_RIGHTS_STATUS_OPTION.value);
    expect(stateSetters[2]).toHaveBeenCalledWith('');
  });
});
