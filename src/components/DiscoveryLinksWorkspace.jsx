import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';
import {
  ALL_DISCOVERY_LINK_STATUS_OPTION,
  ALL_DISCOVERY_RIGHTS_STATUS_OPTION,
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_TONES,
} from '../constants/discoveryLinks';

const LINK_STATUS_OPTIONS = DISCOVERY_LINK_STATUS_OPTIONS;
const ALL_LINK_STATUS_OPTION = ALL_DISCOVERY_LINK_STATUS_OPTION;
const RIGHTS_STATUS_OPTIONS = DISCOVERY_RIGHTS_STATUS_OPTIONS;
const ALL_RIGHTS_STATUS_OPTION = ALL_DISCOVERY_RIGHTS_STATUS_OPTION;
const RIGHTS_STATUS_TONES = DISCOVERY_RIGHTS_TONES;

const PLATFORM_LABELS = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  web: 'Web',
};

const formatDateTime = (value) => {
  if (!value) return '기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '기록 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const getHostName = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '링크';
  }
};

const getUrlPreview = (url) => {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return null;

  try {
    const parsedUrl = new URL(trimmedUrl);
    const host = parsedUrl.hostname.replace(/^www\./, '');
    const platform = host.includes('instagram.com')
      ? 'Instagram'
      : host.includes('youtube.com') || host.includes('youtu.be')
        ? 'YouTube'
        : host.includes('tiktok.com')
          ? 'TikTok'
          : 'Web';

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

const getLinkStatusValue = (link) => link.status || 'inbox';

const getLinkRightsStatusValue = (link) => link.rightsStatus || 'unknown';

const needsRiskyCandidateConfirmation = (status, rightsStatus) => (
  status === 'candidate' && rightsStatus === 'do_not_use'
);

const confirmRiskyCandidate = () => window.confirm(
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

const copyTextToClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const didCopy = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error('copy_failed');
  }
};

const getSearchableLinkText = (link) => (
  [
    link.title,
    link.url,
    link.memo,
    link.platform,
    getHostName(link.url),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
);

function FieldLabel({ children }) {
  return (
    <label className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
      {children}
    </label>
  );
}

function DiscoveryLinkRow({
  link,
  onDelete,
  onUpdate,
  saving,
}) {
  const [copyState, setCopyState] = useState('idle');
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(link.title || '');
  const [draftMemo, setDraftMemo] = useState(link.memo || '');
  const title = link.title || getHostName(link.url);
  const sourceHost = getHostName(link.url);
  const platformLabel = PLATFORM_LABELS[link.platform] || 'Web';
  const currentStatus = link.status || 'inbox';
  const currentRightsStatus = link.rightsStatus || 'unknown';
  const rightsTone = RIGHTS_STATUS_TONES[currentRightsStatus] || RIGHTS_STATUS_TONES.unknown;

  const handleDelete = () => {
    const confirmed = window.confirm('이 발견 링크를 Cloud에서 삭제할까요?');
    if (confirmed) onDelete(link.id);
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;

    if (needsRiskyCandidateConfirmation(nextStatus, currentRightsStatus) && !confirmRiskyCandidate()) {
      event.target.value = currentStatus;
      return;
    }

    onUpdate(link.id, { status: nextStatus });
  };

  const handleCopy = async () => {
    if (!link.url || copyState === 'copying') return;

    setCopyState('copying');
    try {
      await copyTextToClipboard(link.url);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }

    window.setTimeout(() => setCopyState('idle'), 1800);
  };

  const copyButtonLabel = copyState === 'copied'
    ? '복사 완료'
    : copyState === 'copying'
      ? '복사 중'
      : copyState === 'error'
        ? '복사 실패'
        : '복사';

  const openEdit = () => {
    setDraftTitle(link.title || '');
    setDraftMemo(link.memo || '');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraftTitle(link.title || '');
    setDraftMemo(link.memo || '');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const nextTitle = draftTitle.trim();
    const nextMemo = draftMemo.trim();

    if (nextTitle === (link.title || '') && nextMemo === (link.memo || '')) {
      setIsEditing(false);
      return;
    }

    const didSave = await onUpdate(link.id, {
      title: nextTitle,
      memo: nextMemo,
    });

    if (didSave) {
      setIsEditing(false);
    }
  };

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${rightsTone.card}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
              {platformLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
              출처 {sourceHost}
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-extrabold text-indigo-700">
              {LINK_STATUS_OPTIONS.find((option) => option.value === currentStatus)?.label || currentStatus}
            </span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.badge}`}>
              {RIGHTS_STATUS_OPTIONS.find((option) => option.value === currentRightsStatus)?.label || currentRightsStatus}
            </span>
          </div>

          {isEditing ? (
            <div className="mt-3 space-y-3">
              <div>
                <label
                  className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
                  htmlFor={`discovery-title-${link.id}`}
                >
                  제목
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-400"
                  disabled={saving}
                  id={`discovery-title-${link.id}`}
                  onChange={(event) => setDraftTitle(event.target.value)}
                  placeholder="나중에 알아볼 수 있는 이름"
                  value={draftTitle}
                />
              </div>

              <div>
                <label
                  className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
                  htmlFor={`discovery-memo-${link.id}`}
                >
                  메모
                </label>
                <textarea
                  className="mt-1 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400"
                  disabled={saving}
                  id={`discovery-memo-${link.id}`}
                  onChange={(event) => setDraftMemo(event.target.value)}
                  placeholder="왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요."
                  value={draftMemo}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 text-xs font-extrabold text-white transition hover:bg-indigo-500 disabled:bg-slate-300"
                  disabled={saving}
                  onClick={handleSaveEdit}
                  type="button"
                >
                  <Save className="h-4 w-4" />
                  저장
                </button>
                <button
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                  disabled={saving}
                  onClick={cancelEdit}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-950">
                {title}
              </h3>
              <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
              {link.memo ? (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {link.memo}
                </p>
              ) : null}
            </>
          )}
          <p className="mt-3 text-[11px] font-semibold text-slate-400">
            마지막 저장: {formatDateTime(link.updatedAt || link.createdAt)}
          </p>
        </div>

        <div className="grid min-w-[260px] grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto_auto_auto_auto] xl:grid-cols-1">
          <select
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
            disabled={saving}
            value={currentStatus}
            onChange={handleStatusChange}
          >
            {LINK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
            disabled={saving}
            value={currentRightsStatus}
            onChange={(event) => onUpdate(link.id, { rightsStatus: event.target.value })}
          >
            {RIGHTS_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <a
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100"
            href={link.url}
            rel="noreferrer"
            target="_blank"
            title="원본 링크 열기"
          >
            <ExternalLink className="h-4 w-4" />
            열기
          </a>

          <button
            className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3 text-xs font-extrabold transition disabled:opacity-50 ${
              copyState === 'copied'
                ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                : copyState === 'error'
                  ? 'border-red-100 bg-red-50 text-red-600'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="원본 링크 복사"
            disabled={copyState === 'copying'}
            onClick={handleCopy}
            title="원본 링크 복사"
            type="button"
          >
            {copyState === 'copied' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copyButtonLabel}
          </button>

          <button
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="발견 링크 제목과 메모 수정"
            disabled={saving}
            onClick={isEditing ? cancelEdit : openEdit}
            title="제목과 메모 수정"
            type="button"
          >
            {isEditing ? (
              <X className="h-4 w-4" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            {isEditing ? '닫기' : '수정'}
          </button>

          <button
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            aria-label="발견 링크 삭제"
            disabled={saving}
            onClick={handleDelete}
            title="발견 링크 삭제"
            type="button"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

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
  const showRiskyCandidateHint = needsRiskyCandidateConfirmation(form.status, form.rightsStatus);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (needsRiskyCandidateConfirmation(form.status, form.rightsStatus) && !confirmRiskyCandidate()) {
      return;
    }

    const success = await onCreateLink({
      url: form.url.trim(),
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
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl shadow-slate-950/30">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-white">수동 링크 저장</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              링크와 메모만 Cloud에 저장합니다. 외부 사이트 자동 수집, 다운로드, AI 분석은 실행하지 않습니다.
            </p>
          </div>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <FieldLabel>원본 링크</FieldLabel>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
              onChange={(event) => updateForm('url', event.target.value)}
              placeholder="https://..."
              required
              type="url"
              value={form.url}
            />
            {urlPreview && (
              <div className={`rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                urlPreview.isValid
                  ? 'border-indigo-400/20 bg-indigo-500/10 text-indigo-100'
                  : 'border-red-400/30 bg-red-500/10 text-red-100'
              }`}
              >
                <p className="font-extrabold">{urlPreview.label}</p>
                {urlPreview.host ? (
                  <p className="mt-0.5 text-[11px] opacity-80">
                    출처 도메인: {urlPreview.host}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <FieldLabel>제목 또는 기억할 이름</FieldLabel>
            <input
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
              onChange={(event) => updateForm('title', event.target.value)}
              placeholder="나중에 알아볼 수 있는 이름"
              type="text"
              value={form.title}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-1">
            <div className="space-y-1.5">
              <FieldLabel>검토 상태</FieldLabel>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-indigo-400"
                onChange={(event) => updateForm('status', event.target.value)}
                value={form.status}
              >
                {LINK_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <FieldLabel>권리 확인</FieldLabel>
              <select
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm font-bold text-white outline-none transition focus:border-indigo-400"
                onChange={(event) => updateForm('rightsStatus', event.target.value)}
                value={form.rightsStatus}
              >
                {RIGHTS_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {showRiskyCandidateHint && (
            <div className="flex gap-2 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-extrabold">사용 금지 링크를 제작 후보로 저장하려고 합니다</p>
                <p className="mt-1">
                  저장 버튼을 누르면 한 번 더 확인합니다. 실제 제작에 쓰기 전에는 원본과 권리 상태를 다시 확인하세요.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <FieldLabel>메모</FieldLabel>
            <textarea
              className="min-h-28 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm leading-relaxed text-white outline-none transition placeholder:text-slate-600 focus:border-indigo-400"
              onChange={(event) => updateForm('memo', event.target.value)}
              placeholder="왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요."
              value={form.memo}
            />
          </div>

          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            disabled={saving || !form.url.trim()}
            type="submit"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {saving ? 'Cloud 저장 중' : '링크 저장'}
          </button>
        </form>

        <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-xs leading-relaxed text-emerald-100">
          <p className="font-extrabold">안전 기준</p>
          <p className="mt-1">
            저장 영상 조회와 같은 Cloud DB 작업입니다. 유튜브 새 영상 수집이나 외부 사이트 크롤링을 실행하지 않습니다.
          </p>
        </div>
      </section>

      <section className="min-w-0 rounded-2xl border border-slate-200 bg-slate-100 p-5 shadow-xl shadow-slate-950/20">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-700">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-xs font-extrabold uppercase">Cloud 발견함</p>
            </div>
            <h3 className="mt-1 text-xl font-extrabold text-slate-950">저장한 링크 {links.length}개</h3>
            <p className="mt-1 text-xs text-slate-500">
              Cloud에 저장된 수동 링크입니다. 목록이 비어 있으면 Cloud 기준으로 아직 저장된 링크가 없는 상태입니다.
            </p>
          </div>

          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            disabled={loading || saving}
            onClick={onRefresh}
            type="button"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            검토 상태별 보기
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {statusFilterOptions.map((option) => {
              const isActive = statusFilter === option.value;
              return (
                <button
                  className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-3 text-xs font-extrabold transition ${
                    isActive
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  type="button"
                >
                  <span>{option.label}</span>
                  <span className={isActive ? 'text-indigo-500' : 'text-slate-400'}>
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
            권리 확인 상태별 보기
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {rightsFilterOptions.map((option) => {
              const isActive = rightsFilter === option.value;
              const rightsTone = RIGHTS_STATUS_TONES[option.value];
              const buttonTone = rightsTone
                ? `${rightsTone.badge} ${isActive ? 'shadow-sm ring-2 ring-white' : 'opacity-75 hover:opacity-100'}`
                : isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100';
              return (
                <button
                  className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-extrabold transition ${buttonTone}`}
                  key={option.value}
                  onClick={() => setRightsFilter(option.value)}
                  type="button"
                >
                  <span>{option.label}</span>
                  <span className={isActive || rightsTone ? 'text-current opacity-75' : 'text-slate-400'}>
                    {option.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-3">
            <label className="sr-only" htmlFor="discovery-link-search">
              발견 링크 검색
            </label>
            <div className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 transition focus-within:border-indigo-400 focus-within:bg-white">
              <Search className="h-4 w-4 shrink-0" />
              <input
                className="min-w-0 flex-1 bg-transparent py-2 text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                id="discovery-link-search"
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="제목, 메모, URL 검색"
                type="search"
                value={searchQuery}
              />
              {searchQuery ? (
                <button
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  onClick={() => setSearchQuery('')}
                  type="button"
                  aria-label="검색어 지우기"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          {hasActiveDiscoveryFilters ? (
            <p className="mt-2 text-[11px] font-semibold text-slate-500">
              현재 조건에 맞는 링크 {filteredLinks.length}개를 보고 있습니다.
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {savingMessage ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-sm font-semibold text-indigo-700">
            <RefreshCw className="h-4 w-4 shrink-0 animate-spin" />
            {savingMessage}
          </div>
        ) : null}

        {notice && !savingMessage ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {notice}
          </div>
        ) : null}

        {loading ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
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
