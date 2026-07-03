import { useMemo, useState } from 'react';
import {
  getDiscoveryLinkHost,
  getDiscoveryPlatformFromUrl,
  getDiscoveryPlatformLabel,
} from '../constants/discoveryLinks';
import { useDiscoveryLinkFilters } from '../hooks/useDiscoveryLinkFilters';
import DiscoveryLinkForm from './DiscoveryLinkForm';
import DiscoveryLinksFilters from './DiscoveryLinksFilters';
import DiscoveryLinksHeader from './DiscoveryLinksHeader';
import DiscoveryLinksList from './DiscoveryLinksList';
import DiscoveryLinksNotices from './DiscoveryLinksNotices';

const getUrlPreview = (url) => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  try {
    new URL(trimmedUrl);
    const host = getDiscoveryLinkHost(trimmedUrl);
    const platform = getDiscoveryPlatformLabel(getDiscoveryPlatformFromUrl(trimmedUrl));

    return {
      host,
      label: `${platform} 링크로 보입니다`,
      isValid: true,
    };
  } catch {
    return {
      host: '',
      label: '올바른 URL 형식이 아닙니다',
      isValid: false,
    };
  }
};

const normalizeDiscoveryLinkUrl = (url) => {
  const trimmedUrl = (url || '').trim();
  if (!trimmedUrl) return '';

  try {
    const parsedUrl = new URL(trimmedUrl);
    const pathname = parsedUrl.pathname.replace(/\/$/, '');
    const host = parsedUrl.hostname.replace(/^www\./, '');
    return `${parsedUrl.protocol}//${host}${pathname}${parsedUrl.search}`.toLowerCase();
  } catch {
    return trimmedUrl.replace(/\/$/, '').toLowerCase();
  }
};

const needsRiskyCandidateConfirmation = (status, rightsStatus) => (
  status === 'candidate' && rightsStatus === 'do_not_use'
);

const confirmRiskyCandidate = () => window.confirm(
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

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
  const [form, setForm] = useState({
    url: '',
    title: '',
    memo: '',
    status: 'inbox',
    rightsStatus: 'unknown',
  });
  const trimmedFormUrl = form.url.trim();
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

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const urlPreview = getUrlPreview(form.url);
  const duplicateLink = useMemo(() => {
    const normalizedFormUrl = normalizeDiscoveryLinkUrl(trimmedFormUrl);
    if (!normalizedFormUrl) return null;

    return links.find((link) => normalizeDiscoveryLinkUrl(link.url) === normalizedFormUrl) || null;
  }, [links, trimmedFormUrl]);
  const hasInvalidUrl = urlPreview?.isValid === false;
  const isCreateDisabled = saving || !trimmedFormUrl || hasInvalidUrl || Boolean(duplicateLink);
  const showRiskyCandidateHint = needsRiskyCandidateConfirmation(form.status, form.rightsStatus);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isCreateDisabled) {
      return;
    }

    if (needsRiskyCandidateConfirmation(form.status, form.rightsStatus) && !confirmRiskyCandidate()) {
      return;
    }

    const success = await onCreateLink({
      url: trimmedFormUrl,
      platform: getDiscoveryPlatformFromUrl(trimmedFormUrl),
      title: form.title.trim(),
      memo: form.memo.trim(),
      status: form.status,
      rightsStatus: form.rightsStatus,
    });

    if (success) {
      setForm({
        url: '',
        title: '',
        memo: '',
        status: 'inbox',
        rightsStatus: 'unknown',
      });
    }
  };

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
