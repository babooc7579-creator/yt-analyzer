export default function CreatorSidebarItem({
  isActive,
  item,
  onOpenView,
}) {
  const isComingSoon = item.status === 'soon';
  const actionLabel = isComingSoon ? `${item.label} 준비중 안내 보기` : `${item.label} 화면 열기`;

  return (
    <button
      type="button"
      onClick={() => onOpenView(item)}
      className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${isActive ? 'border-indigo-400/60 bg-indigo-500/15 text-white shadow-[inset_3px_0_0_rgba(129,140,248,0.9)]' : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-100'}`}
      aria-current={isActive ? 'page' : undefined}
      title={actionLabel}
      aria-label={actionLabel}
      data-testid={`creator-sidebar-item-${item.id}`}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold">{item.label}</span>
        {isComingSoon && (
          <span className="shrink-0 rounded-full border border-slate-700/70 bg-slate-950/40 px-1.5 py-0.5 text-[8px] font-bold text-slate-500">준비중</span>
        )}
      </span>
    </button>
  );
}
