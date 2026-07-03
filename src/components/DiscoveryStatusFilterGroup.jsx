export default function DiscoveryStatusFilterGroup({
  setStatusFilter,
  statusFilter,
  statusFilterOptions,
}) {
  return (
    <>
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
              title={`${option.label} 상태 링크만 보기`}
              aria-label={`${option.label} 상태 링크 ${option.count}개 보기`}
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
    </>
  );
}
