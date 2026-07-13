import { Database, FilterX } from 'lucide-react';

export default function TtoTtoExplorerEmptyState({
  emptyState,
  onAction,
}) {
  if (!emptyState) return null;

  const Icon = emptyState.kind === 'filtered' ? FilterX : Database;

  return (
    <div className="border border-dashed border-slate-700 bg-slate-950/40 px-5 py-12 text-center">
      <Icon className="mx-auto h-7 w-7 text-slate-500" />
      <h3 className="mt-3 text-base font-extrabold text-white">{emptyState.title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400">{emptyState.description}</p>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-xs font-extrabold text-slate-950 hover:bg-slate-200"
        >
          {emptyState.actionLabel}
        </button>
      )}
    </div>
  );
}
