import { describe, expect, it } from 'vitest';

import { getDiscoveryLinksWorkspaceViewProps } from './discoveryLinksWorkspaceProps';

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
    onRefresh: () => 'refresh',
    onUpdateLink: () => 'update',
    rightsFilter: 'needs_check',
    rightsFilterOptions: [{ value: 'needs_check' }],
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
});
