import { useDiscoveryLinkForm } from '../hooks/useDiscoveryLinkForm';
import { useDiscoveryLinkFilters } from '../hooks/useDiscoveryLinkFilters';
import { getDiscoveryLinksWorkspaceViewProps } from '../utils/discoveryLinksWorkspaceProps';
import DiscoveryLinkForm from './DiscoveryLinkForm';
import DiscoveryLinksFilters from './DiscoveryLinksFilters';
import DiscoveryLinksHeader from './DiscoveryLinksHeader';
import DiscoveryLinksList from './DiscoveryLinksList';
import DiscoveryLinksNotices from './DiscoveryLinksNotices';

export default function DiscoveryLinksWorkspace({
  links,
  loading,
  notice,
  saving,
  savingMessage,
  error,
  onCreateLink,
  onDeleteLink,
  onOpenProductionCandidates,
  onRefresh,
  onUpdateLink,
}) {
  const {
    duplicateLink,
    form,
    handleSubmit,
    isCreateDisabled,
    showRiskyCandidateHint,
    updateForm,
    urlPreview,
  } = useDiscoveryLinkForm({
    links,
    onCreateLink,
    saving,
  });
  const {
    clearDiscoveryFilters,
    filteredDiscoveryLinkUrlList,
    filteredLinks,
    hasActiveDiscoveryFilters,
    rightsFilter,
    rightsFilterOptions,
    searchQuery,
    setRightsFilter,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
    statusFilterOptions,
  } = useDiscoveryLinkFilters(links);
  const {
    filtersProps,
    formProps,
    headerProps,
    listProps,
    noticesProps,
  } = getDiscoveryLinksWorkspaceViewProps({
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
  });

  return (
    <div data-testid="creator-route-discovery-links" className="grid grid-cols-1 gap-4 2xl:grid-cols-[420px_minmax(0,1fr)]">
      <DiscoveryLinkForm {...formProps} />

      <section className="min-w-0 rounded-2xl border border-slate-200 bg-slate-100 p-3 shadow-xl shadow-slate-950/20 sm:p-5">
        <DiscoveryLinksHeader {...headerProps} />

        <DiscoveryLinksFilters {...filtersProps} />

        <DiscoveryLinksNotices {...noticesProps} />

        <DiscoveryLinksList {...listProps} />
      </section>
    </div>
  );
}
