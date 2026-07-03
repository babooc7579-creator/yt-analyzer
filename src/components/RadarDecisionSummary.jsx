export default function RadarDecisionSummary({ summary }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2">
        <p className="text-[10px] font-extrabold text-emerald-100">봤음</p>
        <p className="mt-1 text-lg font-black text-white">{summary.reviewed}</p>
      </div>
      <div className="rounded-xl border border-slate-500/30 bg-slate-900/60 px-3 py-2">
        <p className="text-[10px] font-extrabold text-slate-200">나중에 보기</p>
        <p className="mt-1 text-lg font-black text-white">{summary.later}</p>
      </div>
      <div className="rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-3 py-2">
        <p className="text-[10px] font-extrabold text-indigo-100">제작 후보</p>
        <p className="mt-1 text-lg font-black text-white">{summary.production}</p>
      </div>
      <div className="rounded-xl border border-slate-500/30 bg-slate-950/70 px-3 py-2">
        <p className="text-[10px] font-extrabold text-slate-300">제외</p>
        <p className="mt-1 text-lg font-black text-white">{summary.excluded}</p>
      </div>
    </div>
  );
}
