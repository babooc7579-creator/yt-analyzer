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

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-[420px_minmax(0,1fr)]">
      <DiscoveryLinkForm
        duplicateLink={duplicateLink}
        form={form}
        isCreateDisabled={isCreateDisabled}
        saving={saving}
        showRiskyCandidateHint={showRiskyCandidateHint}
        urlPreview={urlPreview}
        onChange={updateForm}
        onSubmit={handleSubmit}
      />

      <section className="min-w-0 rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-xl shadow-slate-950/20">
        <DiscoveryLinksHeader
          filteredLinkCount={filteredLinks.length}
          loading={loading}
          onRefresh={onRefresh}
          saving={saving}
          totalLinkCount={links.length}
          urlList={filteredDiscoveryLinkUrlList}
        />

        <DiscoveryLinksFilters
          filteredLinkCount={filteredLinks.length}
          hasActiveFilters={hasActiveDiscoveryFilters}
          rightsFilter={rightsFilter}
          rightsFilterOptions={rightsFilterOptions}
          searchQuery={searchQuery}
          setRightsFilter={setRightsFilter}
          setSearchQuery={setSearchQuery}
          setStatusFilter={setStatusFilter}
          statusFilter={statusFilter}
          statusFilterOptions={statusFilterOptions}
        />

        <DiscoveryLinksNotices
          error={error}
          notice={notice}
          savingMessage={savingMessage}
        />

        <DiscoveryLinksList
          allLinkCount={links.length}
          clearFilters={clearDiscoveryFilters}
          filteredLinks={filteredLinks}
          loading={loading}
          onDeleteLink={onDeleteLink}
          onUpdateLink={onUpdateLink}
          saving={saving}
        />
      </section>
    </div>
  );
}
