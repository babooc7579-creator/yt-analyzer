export default function ChannelTagSelector({
  categories,
  label,
  selectedTags,
  toggleTag,
}) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => toggleTag(category)}
            className={`px-2 py-1 rounded-full text-[11px] font-semibold border transition-colors ${selectedTags.includes(category) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
            title={`${category} 태그 ${selectedTags.includes(category) ? '선택 해제' : '선택'}`}
            aria-label={`${category} 태그 ${selectedTags.includes(category) ? '선택 해제' : '선택'}`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
