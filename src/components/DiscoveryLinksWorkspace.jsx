import { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Link as LinkIcon,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

const LINK_STATUS_OPTIONS = [
  { value: 'inbox', label: '수집함' },
  { value: 'reviewing', label: '검토중' },
  { value: 'saved', label: '저장' },
  { value: 'candidate', label: '제작 후보' },
  { value: 'discarded', label: '제외' },
];

const RIGHTS_STATUS_OPTIONS = [
  { value: 'unknown', label: '미확인' },
  { value: 'needs_check', label: '권리 확인 필요' },
  { value: 'cleared', label: '사용 가능 확인' },
  { value: 'do_not_use', label: '사용 금지' },
];

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
  const title = link.title || getHostName(link.url);
  const platformLabel = PLATFORM_LABELS[link.platform] || 'Web';
  const currentStatus = link.status || 'inbox';
  const currentRightsStatus = link.rightsStatus || 'unknown';

  const handleDelete = () => {
    const confirmed = window.confirm('이 발견 링크를 Cloud에서 삭제할까요?');
    if (confirmed) onDelete(link.id);
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
              {platformLabel}
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-extrabold text-indigo-700">
              {LINK_STATUS_OPTIONS.find((option) => option.value === currentStatus)?.label || currentStatus}
            </span>
            <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-extrabold text-amber-700">
              {RIGHTS_STATUS_OPTIONS.find((option) => option.value === currentRightsStatus)?.label || currentRightsStatus}
            </span>
          </div>

          <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-950">
            {title}
          </h3>
          <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
          {link.memo ? (
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
              {link.memo}
            </p>
          ) : null}
          <p className="mt-3 text-[11px] font-semibold text-slate-400">
            마지막 저장: {formatDateTime(link.updatedAt || link.createdAt)}
          </p>
        </div>

        <div className="grid min-w-[260px] grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto_auto] xl:grid-cols-1">
          <select
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 outline-none transition focus:border-indigo-400"
            disabled={saving}
            value={currentStatus}
            onChange={(event) => onUpdate(link.id, { status: event.target.value })}
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

  const updateForm = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3">
            {links.map((link) => (
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
