export default function KeywordSuggestionChips({ onSelect, suggestions }) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return null;

  return (
    <section aria-labelledby="collected-channel-reaction-title" className="border border-cyan-500/20 bg-cyan-500/5 p-4">
      <div>
        <p id="collected-channel-reaction-title" className="text-sm font-extrabold text-white">수집 채널 반응도</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          현재 불러온 레퍼런스 채널의 수집 영상에서 반복·채널 확산·최근 등장·조회 반응을 비교한 상대 점수입니다.
          외부 검색량이나 완전한 실시간 지표가 아니며, 마지막 수집 데이터 기준입니다.
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion.label}
            type="button"
            onClick={() => onSelect(suggestion.label)}
            className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-left hover:border-cyan-500"
            title={`${suggestion.label}: 수집 채널 반응도 ${suggestion.reactionScore}점, 수집 영상 ${suggestion.count}개, 채널 ${suggestion.channelCount}개에서 확인했습니다. 선택하면 현재 수집 영상 안에서 검색하며 API 호출이나 저장은 없습니다.`}
          >
            <span className="block text-xs font-extrabold text-cyan-100">{suggestion.label}</span>
            <span className="mt-1 block text-[10px] font-bold text-slate-500">
              반응도 {suggestion.reactionScore} · 영상 {suggestion.count} · 채널 {suggestion.channelCount}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
