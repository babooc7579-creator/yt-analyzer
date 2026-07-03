import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkStatusLabel,
  getDiscoveryPlatformFromUrl,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import { formatNumberedUrlList } from '../utils/urls';
import DiscoveryLinkForm from './DiscoveryLinkForm';
import DiscoveryLinksFilters from './DiscoveryLinksFilters';
import DiscoveryLinksHeader from './DiscoveryLinksHeader';
import DiscoveryLinkRow from './DiscoveryLinkRow';

const LINK_STATUS_OPTIONS = DISCOVERY_LINK_STATUS_OPTIONS;
const ALL_LINK_STATUS_OPTION = ALL_DISCOVERY_LINK_STATUS_OPTION;
const RIGHTS_STATUS_OPTIONS = DISCOVERY_RIGHTS_STATUS_OPTIONS;
const ALL_RIGHTS_STATUS_OPTION = ALL_DISCOVERY_RIGHTS_STATUS_OPTION;

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

const getLinkStatusValue = (link) => link.status || 'inbox';

const getLinkRightsStatusValue = (link) => link.rightsStatus || 'unknown';

const needsRiskyCandidateConfirmation = (status, rightsStatus) => (
  status === 'candidate' && rightsStatus === 'do_not_use'
);

const confirmRiskyCandidate = () => window.confirm(
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

const getSearchableLinkText = (link) => (
  [
    link.title,
    link.url,
    link.memo,
    getDiscoveryLinkPlatform(link),
    getDiscoveryLinkHost(link.url),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
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
  const [statusFilter, setStatusFilter] = useState(ALL_LINK_STATUS_OPTION.value);
  const [rightsFilter, setRightsFilter] = useState(ALL_RIGHTS_STATUS_OPTION.value);
  const [searchQuery, setSearchQuery] = useState('');
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const trimmedFormUrl = form.url.trim();

  const statusCounts = useMemo(() => (
    links.reduce((counts, link) => {
      const status = getLinkStatusValue(link);
      return {
        ...counts,
        [status]: (counts[status] || 0) + 1,
      };
    }, {})
  ), [links]);

  const rightsCounts = useMemo(() => (
    links.reduce((counts, link) => {
      const rightsStatus = getLinkRightsStatusValue(link);
      return {
        ...counts,
        [rightsStatus]: (counts[rightsStatus] || 0) + 1,
      };
    }, {})
  ), [links]);

  const statusMatchedLinks = useMemo(() => {
    if (statusFilter === ALL_LINK_STATUS_OPTION.value) return links;
    return links.filter((link) => getLinkStatusValue(link) === statusFilter);
  }, [links, statusFilter]);

  const rightsMatchedLinks = useMemo(() => {
    if (rightsFilter === ALL_RIGHTS_STATUS_OPTION.value) return statusMatchedLinks;
    return statusMatchedLinks.filter((link) => (
      getLinkRightsStatusValue(link) === rightsFilter
    ));
  }, [rightsFilter, statusMatchedLinks]);

  const filteredLinks = useMemo(() => {
    if (!normalizedSearchQuery) return rightsMatchedLinks;
    return rightsMatchedLinks.filter((link) => (
      getSearchableLinkText(link).includes(normalizedSearchQuery)
    ));
  }, [normalizedSearchQuery, rightsMatchedLinks]);

  const hasActiveDiscoveryFilters = statusFilter !== ALL_LINK_STATUS_OPTION.value
    || rightsFilter !== ALL_RIGHTS_STATUS_OPTION.value
    || Boolean(normalizedSearchQuery);
  const filteredDiscoveryLinkUrlList = useMemo(() => (
    formatNumberedUrlList(
      filteredLinks.map((link) => {
        const title = link.title || getDiscoveryLinkHost(link.url);
        const statusLabel = getDiscoveryLinkStatusLabel(getLinkStatusValue(link));
        const rightsLabel = getDiscoveryRightsStatusLabel(getLinkRightsStatusValue(link));

        return link.url ? [
          title,
          link.url,
          `상태: ${statusLabel} · 권리: ${rightsLabel}`,
        ] : null;
      })
    )
  ), [filteredLinks]);

  const statusFilterOptions = useMemo(() => ([
    { ...ALL_LINK_STATUS_OPTION, count: links.length },
    ...LINK_STATUS_OPTIONS.map((option) => ({
      ...option,
      count: statusCounts[option.value] || 0,
    })),
  ]), [links.length, statusCounts]);

  const rightsFilterOptions = useMemo(() => ([
    { ...ALL_RIGHTS_STATUS_OPTION, count: links.length },
    ...RIGHTS_STATUS_OPTIONS.map((option) => ({
      ...option,
      count: rightsCounts[option.value] || 0,
    })),
  ]), [links.length, rightsCounts]);

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const clearDiscoveryFilters = () => {
    setStatusFilter(ALL_LINK_STATUS_OPTION.value);
    setRightsFilter(ALL_RIGHTS_STATUS_OPTION.value);
    setSearchQuery('');
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

        {error ? (
          <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {savingMessage ? (
          <div role="status" aria-live="polite" className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-semibold text-indigo-700">
            <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
            {savingMessage}
          </div>
        ) : null}

        {notice && !savingMessage ? (
          <div role="status" aria-live="polite" className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {notice}
          </div>
        ) : null}

        {loading ? (
          <div role="status" aria-live="polite" className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
            Cloud 발견함을 불러오는 중입니다.
          </div>
        ) : links.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm font-extrabold text-slate-700">아직 저장된 발견 링크가 없습니다.</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              왼쪽에서 링크를 하나 저장하면 이곳에 검토 목록이 생깁니다.
            </p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
            <p className="text-sm font-extrabold text-slate-700">조건에 맞는 링크가 없습니다.</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Cloud에는 링크 {links.length}개가 저장되어 있지만, 현재 검색어나 필터 조건 때문에 보이지 않습니다.
            </p>
            <button
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
              onClick={clearDiscoveryFilters}
              title="검색어와 필터를 모두 초기화"
              aria-label="발견함 필터 초기화"
              type="button"
            >
              <X className="h-4 w-4" />
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3">
            {filteredLinks.map((link) => (
              <DiscoveryLinkRow
                key={link.id}
                link={link}
                onDelete={onDeleteLink}
                onUpdate={onUpdateLink}
                saving={saving}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
