const toArray = (items) => (Array.isArray(items) ? items : []);

export const getDiscoveryLinksFiltersChildProps = ({
  filteredLinkCount,
  onClearFilters,
  rightsFilter,
  rightsFilterOptions,
  searchQuery,
  setRightsFilter,
  setSearchQuery,
  setStatusFilter,
  statusFilter,
  statusFilterOptions,
}) => ({
  activeFilterSummaryProps: {
    filteredLinkCount,
    onClearFilters,
  },
  rightsFilterProps: {
    rightsFilter,
    rightsFilterOptions,
    setRightsFilter,
  },
  searchBoxProps: {
    searchQuery,
    setSearchQuery,
  },
  statusFilterProps: {
    setStatusFilter,
    statusFilter,
    statusFilterOptions,
  },
});

export const getDiscoveryLinksHeaderActionsProps = ({
  filteredLinkCount,
  loading,
  onRefresh,
  onOpenProductionCandidates,
  saving,
  urlList,
}) => ({
  filteredLinkCount,
  loading,
  onOpenProductionCandidates,
  onRefresh,
  saving,
  urlList,
});

export const getDiscoveryLinksListViewProps = ({
  allLinkCount,
  clearFilters,
  filteredLinks,
  onDeleteLink,
  onOpenProductionCandidates,
  onUpdateLink,
  saving,
}) => {
  const linkList = toArray(filteredLinks);

  return {
    filteredEmptyStateProps: {
      allLinkCount,
      clearFilters,
    },
    gridProps: {
      filteredLinks: linkList,
      onDeleteLink,
      onOpenProductionCandidates,
      onUpdateLink,
      saving,
    },
    linkList,
  };
};

export const getDiscoveryLinksWorkspaceViewProps = ({
  clearDiscoveryFilters,
  duplicateLink,
  error,
  filteredDiscoveryLinkUrlList,
  filteredLinks,
  form,
  handleSubmit,
  hasActiveDiscoveryFilters,
  isCreateDisabled,
  links,
  loading,
  notice,
  onDeleteLink,
  onOpenProductionCandidates,
  onRefresh,
  onUpdateLink,
  rightsFilter,
  rightsFilterOptions,
  saving,
  savingMessage,
  searchQuery,
  setRightsFilter,
  setSearchQuery,
  setStatusFilter,
  showRiskyCandidateHint,
  statusFilter,
  statusFilterOptions,
  updateForm,
  urlPreview,
}) => {
  const linkList = toArray(links);
  const filteredLinkList = toArray(filteredLinks);

  return {
    filtersProps: {
      filteredLinkCount: filteredLinkList.length,
      hasActiveFilters: hasActiveDiscoveryFilters,
      onClearFilters: clearDiscoveryFilters,
      rightsFilter,
      rightsFilterOptions,
      searchQuery,
      setRightsFilter,
      setSearchQuery,
      setStatusFilter,
      statusFilter,
      statusFilterOptions,
    },
    formProps: {
      duplicateLink,
      form,
      isCreateDisabled,
      saving,
      showRiskyCandidateHint,
      urlPreview,
      onChange: updateForm,
      onSubmit: handleSubmit,
    },
    headerProps: {
      filteredLinkCount: filteredLinkList.length,
      loading,
      onOpenProductionCandidates,
      onRefresh,
      saving,
      totalLinkCount: linkList.length,
      urlList: filteredDiscoveryLinkUrlList,
    },
    listProps: {
      allLinkCount: linkList.length,
      clearFilters: clearDiscoveryFilters,
      filteredLinks: filteredLinkList,
      loading,
      onDeleteLink,
      onOpenProductionCandidates,
      onUpdateLink,
      saving,
    },
    noticesProps: {
      error,
      loading,
      notice,
      onRefresh,
      savingMessage,
    },
  };
};
