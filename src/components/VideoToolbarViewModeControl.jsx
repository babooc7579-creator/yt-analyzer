const VIEW_MODE_OPTIONS = [
  {
    value: 'card',
    label: '카드 보기',
    title: '영상 후보를 카드 형태로 보기',
    ariaLabel: '카드 보기로 전환',
  },
  {
    value: 'list',
    label: '리스트 보기',
    title: '영상 후보를 표 형태로 보기',
    ariaLabel: '리스트 보기로 전환',
  },
];

export default function VideoToolbarViewModeControl({ setViewMode, viewMode }) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
      {VIEW_MODE_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setViewMode(option.value)}
          title={option.title}
          aria-label={option.ariaLabel}
          className={`px-3 py-1 text-sm font-bold rounded-md transition-all ${
            viewMode === option.value
              ? 'bg-white shadow text-indigo-700'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
