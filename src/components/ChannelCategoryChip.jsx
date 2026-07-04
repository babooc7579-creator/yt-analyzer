import { CheckCircle2, Loader2, Settings, Trash2, X } from 'lucide-react';

export default function ChannelCategoryChip({
  cancelRenameCategory,
  category,
  confirmRenameCategory,
  hideCategoryFromLocalList,
  isRenaming,
  renameLoading,
  renameValue,
  setRenameValue,
  startRenameCategory,
}) {
  if (isRenaming) {
    return (
      <span className="inline-flex items-center gap-1 px-1 py-0.5 bg-white border border-indigo-300 rounded ring-1 ring-indigo-200">
        <input
          autoFocus
          type="text"
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') confirmRenameCategory(); if (e.key === 'Escape') cancelRenameCategory(); }}
          className="text-[10px] px-1 py-0.5 w-16 border border-slate-200 rounded outline-none"
          title="변경할 Cloud 태그 이름 입력"
          aria-label={`${category} Cloud 태그 새 이름`}
        />
        <button
          type="button"
          onClick={confirmRenameCategory}
          disabled={renameLoading}
          className="text-emerald-600 hover:text-emerald-800"
          title="Cloud 태그 이름 변경 저장"
          aria-label={`${category} Cloud 태그 이름 변경 저장`}
        >
          {renameLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
        </button>
        <button
          type="button"
          onClick={cancelRenameCategory}
          className="text-slate-400 hover:text-slate-600"
          title="태그 이름 변경 취소"
          aria-label={`${category} 태그 이름 변경 취소`}
        >
          <X className="w-2.5 h-2.5" />
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">
      {category}
      <button
        type="button"
        onClick={() => startRenameCategory(category)}
        className="text-indigo-400 hover:text-indigo-600"
        title="Cloud 태그 이름 변경 - 이 태그가 붙은 모든 채널에 일괄 반영됩니다"
        aria-label={`${category} Cloud 태그 이름 변경`}
      >
        <Settings className="w-2.5 h-2.5" />
      </button>
      <button
        type="button"
        onClick={() => hideCategoryFromLocalList(category)}
        className="text-red-400 hover:text-red-600"
        title="화면 목록에서만 숨깁니다. 이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다."
        aria-label={`${category} 카테고리를 화면 목록에서만 숨기기`}
      >
        <Trash2 className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}
