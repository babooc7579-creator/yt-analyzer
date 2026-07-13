export default function KeywordSuggestionChips({ onSelect, suggestions }) {
  if (!Array.isArray(suggestions) || suggestions.length === 0) return null;

  return (
    <section aria-label="저장 영상 제목 추천 검색어" className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-extrabold text-slate-500">제목 추천어</span>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.label}
          type="button"
          onClick={() => onSelect(suggestion.label)}
          className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-bold text-slate-300 hover:border-cyan-500 hover:text-cyan-200"
          title={`현재 불러온 저장 영상 제목 ${suggestion.count}개에서 확인된 단어입니다. 선택만으로 API 호출이나 저장은 없습니다.`}
        >
          {suggestion.label} <span className="text-slate-600">{suggestion.count}</span>
        </button>
      ))}
    </section>
  );
}
