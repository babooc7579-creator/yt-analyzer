export default function DiscoveryLinksRouteContext({
  context,
  onReset,
  onReturnToProductionCandidates,
}) {
  if (!context) return null;

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-extrabold text-amber-900">{context.label}</p>
        <p className="mt-1 break-words text-xs leading-relaxed text-amber-700">{context.description}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {typeof onReturnToProductionCandidates === 'function' ? (
          <button
            className="inline-flex h-8 items-center justify-center rounded-lg border border-amber-300 bg-amber-100 px-3 text-xs font-extrabold text-amber-900 transition hover:bg-amber-200"
            onClick={onReturnToProductionCandidates}
            title={context.returnTitle}
            type="button"
          >
            {context.returnLabel}
          </button>
        ) : null}
        <button
          className="inline-flex h-8 items-center justify-center rounded-lg border border-amber-300 bg-white px-3 text-xs font-extrabold text-amber-800 transition hover:bg-amber-100"
          onClick={onReset}
          title={context.resetTitle}
          type="button"
        >
          {context.resetLabel}
        </button>
      </div>
    </div>
  );
}
