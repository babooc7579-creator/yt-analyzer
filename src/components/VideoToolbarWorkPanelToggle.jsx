export default function VideoToolbarWorkPanelToggle({
  setShowWorkPanel,
  showWorkPanel,
}) {
  return (
    <button
      type="button"
      onClick={() => setShowWorkPanel(!showWorkPanel)}
      className={`px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
        showWorkPanel
          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-700'
      }`}
      title={showWorkPanel ? '작업 패널 숨기기' : '카드 보기에서 작업 패널 함께 보기'}
      aria-label={showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기'}
    >
      {showWorkPanel ? '작업 패널 닫기' : '작업 패널 열기'}
    </button>
  );
}
