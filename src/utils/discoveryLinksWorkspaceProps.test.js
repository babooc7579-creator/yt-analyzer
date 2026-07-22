import { describe, expect, it } from 'vitest';

import {
  getDiscoveryLinksFiltersChildProps,
  getDiscoveryLinksHeaderActionsProps,
  getDiscoveryLinksListViewProps,
  getDiscoveryLinksWorkspaceViewProps,
} from './discoveryLinksWorkspaceProps';

describe('discoveryLinksWorkspaceProps utils', () => {
  const baseProps = {
    clearDiscoveryFilters: () => 'clear',
    duplicateLink: { id: 'duplicate' },
    error: '',
    filteredDiscoveryLinkUrlList: [['Clip', 'https://example.com', 'status']],
    filteredLinks: [{ id: 'visible' }],
    form: { url: 'https://example.com', status: 'inbox' },
    handleSubmit: () => 'submit',
    hasActiveDiscoveryFilters: true,
    isCreateDisabled: false,
    links: [{ id: 'visible' }, { id: 'hidden' }],
    loading: false,
    notice: 'Loaded',
    onDeleteLink: () => 'delete',
    onOpenProductionCandidates: () => 'open candidates',
    onRefresh: () => 'refresh',
    onReturnToProductionCandidates: () => 'return to candidate',
    onUpdateLink: () => 'update',
    rightsFilter: 'needs_check',
    rightsFilterOptions: [{ value: 'needs_check' }],
    routeContext: { label: '제작 후보함에서 이어온 링크' },
    saving: false,
    savingMessage: '',
    searchQuery: 'clip',
    setRightsFilter: () => 'set rights',
    setSearchQuery: () => 'set search',
    setStatusFilter: () => 'set status',
    showRiskyCandidateHint: false,
    statusFilter: 'candidate',
    statusFilterOptions: [{ value: 'candidate' }],
    updateForm: () => 'update form',
    urlPreview: { host: 'example.com' },
  };

  it('splits discovery workspace state into filters, form, header, list, and notices props', () => {
    const viewProps = getDiscoveryLinksWorkspaceViewProps(baseProps);

    expect(viewProps.filtersProps).toMatchObject({
      filteredLinkCount: 1,
      hasActiveFilters: true,
      onClearFilters: baseProps.clearDiscoveryFilters,
      rightsFilter: 'needs_check',
      searchQuery: 'clip',
      statusFilter: 'candidate',
    });
    expect(viewProps.formProps).toMatchObject({
      duplicateLink: { id: 'duplicate' },
      form: { url: 'https://example.com', status: 'inbox' },
      isCreateDisabled: false,
      saving: false,
      showRiskyCandidateHint: false,
      urlPreview: { host: 'example.com' },
    });
    expect(viewProps.headerProps).toMatchObject({
      filteredLinkCount: 1,
      loading: false,
      onOpenProductionCandidates: baseProps.onOpenProductionCandidates,
      saving: false,
      totalLinkCount: 2,
      urlList: [['Clip', 'https://example.com', 'status']],
    });
    expect(viewProps.listProps).toMatchObject({
      allLinkCount: 2,
      filteredLinks: [{ id: 'visible' }],
      loading: false,
      saving: false,
    });
    expect(viewProps.noticesProps).toMatchObject({
      error: '',
      loading: false,
      notice: 'Loaded',
      savingMessage: '',
    });
    expect(viewProps.routeContextProps).toEqual({
      context: baseProps.routeContext,
      onReset: baseProps.clearDiscoveryFilters,
      onReturnToProductionCandidates: baseProps.onReturnToProductionCandidates,
    });
  });

  it('uses empty lists when links or filtered links are not arrays', () => {
    const viewProps = getDiscoveryLinksWorkspaceViewProps({
      ...baseProps,
      filteredLinks: null,
      links: undefined,
    });

    expect(viewProps.filtersProps.filteredLinkCount).toBe(0);
    expect(viewProps.headerProps.filteredLinkCount).toBe(0);
    expect(viewProps.headerProps.totalLinkCount).toBe(0);
    expect(viewProps.listProps.allLinkCount).toBe(0);
    expect(viewProps.listProps.filteredLinks).toEqual([]);
  });

  it('builds discovery filter child props with active summary count', () => {
    const props = getDiscoveryLinksFiltersChildProps({
      ...baseProps,
      filteredLinkCount: 3,
      onClearFilters: baseProps.clearDiscoveryFilters,
    });

    expect(props).toMatchObject({
      activeFilterSummaryProps: {
        filteredLinkCount: 3,
        onClearFilters: baseProps.clearDiscoveryFilters,
      },
      rightsFilterProps: {
        rightsFilter: 'needs_check',
        rightsFilterOptions: [{ value: 'needs_check' }],
        setRightsFilter: baseProps.setRightsFilter,
      },
      searchBoxProps: {
        searchQuery: 'clip',
        setSearchQuery: baseProps.setSearchQuery,
      },
      statusFilterProps: {
        setStatusFilter: baseProps.setStatusFilter,
        statusFilter: 'candidate',
        statusFilterOptions: [{ value: 'candidate' }],
      },
    });
  });

  it('builds discovery header actions props without changing handlers', () => {
    expect(getDiscoveryLinksHeaderActionsProps({
      filteredLinkCount: 1,
      loading: true,
      onOpenProductionCandidates: baseProps.onOpenProductionCandidates,
      onRefresh: baseProps.onRefresh,
      saving: false,
      urlList: baseProps.filteredDiscoveryLinkUrlList,
    })).toEqual({
      filteredLinkCount: 1,
      loading: true,
      onOpenProductionCandidates: baseProps.onOpenProductionCandidates,
      onRefresh: baseProps.onRefresh,
      saving: false,
      urlList: baseProps.filteredDiscoveryLinkUrlList,
    });
  });

  it('builds discovery list view props with safe filtered list fallback', () => {
    const props = getDiscoveryLinksListViewProps({
      allLinkCount: 2,
      clearFilters: baseProps.clearDiscoveryFilters,
      filteredLinks: [{ id: 'visible' }],
      onDeleteLink: baseProps.onDeleteLink,
      onUpdateLink: baseProps.onUpdateLink,
      saving: true,
    });

    expect(props.linkList).toEqual([{ id: 'visible' }]);
    expect(props.filteredEmptyStateProps).toEqual({
      allLinkCount: 2,
      clearFilters: baseProps.clearDiscoveryFilters,
    });
    expect(props.gridProps).toMatchObject({
      filteredLinks: [{ id: 'visible' }],
      onDeleteLink: baseProps.onDeleteLink,
      onUpdateLink: baseProps.onUpdateLink,
      saving: true,
    });

    expect(getDiscoveryLinksListViewProps({
      allLinkCount: 1,
      clearFilters: baseProps.clearDiscoveryFilters,
      filteredLinks: null,
      onDeleteLink: baseProps.onDeleteLink,
      onUpdateLink: baseProps.onUpdateLink,
      saving: false,
    }).linkList).toEqual([]);
  });
});
