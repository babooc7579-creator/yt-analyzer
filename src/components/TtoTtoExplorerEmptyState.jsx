import { Database, FilterX, Loader2 } from 'lucide-react';

export default function TtoTtoExplorerEmptyState({
  emptyState,
  loading = false,
  onAction,
}) {
  if (!emptyState) return null;

  const Icon = loading ? Loader2 : emptyState.kind === 'filtered' ? FilterX : Database;

  return (
    <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
      <Icon className={`mx-auto h-7 w-7 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
      <h3 className="mt-3 text-base font-extrabold text-white">{emptyState.title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{emptyState.description}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          disabled={loading}
          title={emptyState.actionTitle}
          aria-label={emptyState.actionAriaLabel || emptyState.actionLabel}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          {loading ? '저장 영상 불러오는 중...' : emptyState.actionLabel}
        </button>
      )}
    </div>
  );
}
