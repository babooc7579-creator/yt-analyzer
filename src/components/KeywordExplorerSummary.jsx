import { formatCompactKo } from '../utils/formatters';

const SUMMARY_ITEMS = [
  ['loadedVideoCount', '불러온 영상'],
  ['matchedVideoCount', '검색 결과'],
  ['channelCount', '일치 채널'],
  ['averageViews', '평균 조회수'],
  ['strongestMultiplier', '최고 대박 지수'],
];

export default function KeywordExplorerSummary({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
      {SUMMARY_ITEMS.map(([key, label]) => {
        const rawValue = Number(summary?.[key] || 0);
        const value = key === 'strongestMultiplier'
          ? `${rawValue.toFixed(1)}x`
          : key === 'averageViews'
            ? formatCompactKo(rawValue)
            : rawValue.toLocaleString();

        return (
          <div key={key} className="border border-slate-800 bg-slate-950/60 px-3 py-3">
            <p className="text-[10px] font-extrabold text-slate-500">{label}</p>
            <p className="mt-1 text-lg font-black text-white">{value}</p>
          </div>
        );
      })}
    </div>
  );
}
