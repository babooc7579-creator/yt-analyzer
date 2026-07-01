import { CREATOR_OS_PRODUCT_MAP } from '../constants/creatorOs';

export default function CreatorSidebar({ activeView, onOpenView }) {
  return (
    <aside className="xl:sticky xl:top-6 xl:h-[calc(100vh-48px)] xl:w-[350px] shrink-0 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-2xl shadow-slate-950/40 [scrollbar-color:#334155_transparent] [scrollbar-width:thin]">
      <div className="mb-5 rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-slate-950 to-indigo-950/80 p-4 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-200">타임머신 CRM</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Creator OS</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">유튜브 레퍼런스를 발굴하고 제작 자산으로 축적하는 지휘실입니다.</p>
      </div>

      <div className="space-y-5">
        {CREATOR_OS_PRODUCT_MAP.map(section => (
          <div key={section.title}>
            <div className="mb-2.5 px-1">
              <p className="text-[11px] font-extrabold tracking-wide text-slate-100">{section.title}</p>
              <p className="text-[10px] leading-snug text-slate-500">{section.description}</p>
            </div>
            <div className="space-y-1.5">
              {section.items.map(item => {
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onOpenView(item)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${isActive ? 'border-indigo-400/60 bg-indigo-500/15 text-white shadow-[inset_3px_0_0_rgba(129,140,248,0.9)]' : 'border-transparent text-slate-400 hover:border-slate-700 hover:bg-slate-800/70 hover:text-slate-100'}`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{item.label}</span>
                      {item.status === 'soon' && (
                        <span className="shrink-0 rounded-full border border-slate-700/70 bg-slate-950/40 px-1.5 py-0.5 text-[8px] font-bold text-slate-500">준비중</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
