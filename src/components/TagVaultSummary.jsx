const SUMMARY_ITEMS = [
  ['tagCount', '사용 태그'],
  ['tagChannelCount', '태그 채널'],
  ['selectedChannelCount', '현재 선택 채널'],
  ['loadedVideoCount', '불러온 영상'],
  ['matchedVideoCount', '태그 영상'],
];

export default function TagVaultSummary({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {SUMMARY_ITEMS.map(([key, label]) => (
        <div key={key} className="border border-slate-800 bg-slate-950/60 px-3 py-3">
          <p className="text-[10px] font-extrabold text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-black text-white">{Number(summary?.[key] || 0).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
