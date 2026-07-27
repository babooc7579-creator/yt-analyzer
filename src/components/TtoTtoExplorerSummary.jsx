const SUMMARY_ITEMS = [
  { key: 'loadedVideoCount', label: '불러온 수집 영상 정보', tone: 'text-blue-200' },
  { key: 'totalCandidateCount', label: '기준 충족', tone: 'text-rose-200' },
  { key: 'openCandidateCount', label: '검토 대기', tone: 'text-amber-200' },
  { key: 'handledCandidateCount', label: '처리 완료', tone: 'text-emerald-200' },
  { key: 'filteredCandidateCount', label: '현재 표시', tone: 'text-white' },
];

export default function TtoTtoExplorerSummary({ summary = {} }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
      {SUMMARY_ITEMS.map((item) => (
        <div key={item.key} className="border-l-2 border-slate-700 bg-slate-950/50 px-3 py-2">
          <p className="text-[10px] font-bold text-slate-500">{item.label}</p>
          <p className={`mt-1 text-xl font-black ${item.tone}`}>{Number(summary[item.key] || 0)}</p>
        </div>
      ))}
    </div>
  );
}
