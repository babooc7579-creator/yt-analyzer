import { useDiscoveryLinkForm } from '../hooks/useDiscoveryLinkForm';
import { useDiscoveryLinkFilters } from '../hooks/useDiscoveryLinkFilters';
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
  const formProps = {
    duplicateLink,
    form,
    isCreateDisabled,
    saving,
    showRiskyCandidateHint,
    urlPreview,
    onChange: updateForm,
    onSubmit: handleSubmit,
  };

  const headerProps = {
    filteredLinkCount: filteredLinks.length,
    loading,
    onRefresh,
    saving,
    totalLinkCount: links.length,
    urlList: filteredDiscoveryLinkUrlList,
  };

  const filtersProps = {
    filteredLinkCount: filteredLinks.length,
    hasActiveFilters: hasActiveDiscoveryFilters,
    rightsFilter,
    rightsFilterOptions,
    searchQuery,
    setRightsFilter,
    setSearchQuery,
    setStatusFilter,
    statusFilter,
    statusFilterOptions,
  };

  const noticesProps = {
    error,
    notice,
    savingMessage,
  };

  const listProps = {
    allLinkCount: links.length,
    clearFilters: clearDiscoveryFilters,
    filteredLinks,
    loading,
    onDeleteLink,
    onUpdateLink,
    saving,
  };

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[420px_minmax(0,1fr)]">
      <DiscoveryLinkForm {...formProps} />

      <section className="min-w-0 rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-xl shadow-slate-950/20">
        <DiscoveryLinksHeader {...headerProps} />

        <DiscoveryLinksFilters {...filtersProps} />

        <DiscoveryLinksNotices {...noticesProps} />

        <DiscoveryLinksList {...listProps} />
      </section>
    </div>
  );
}
