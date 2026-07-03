import { CheckCircle2, Loader2, Plus, Settings, Trash2, X } from 'lucide-react';

export default function ChannelCategorySettings({
  cancelRenameCategory,
  categories,
  cloudOnlyTags = [],
  confirmRenameCategory,
  newCategoryName,
  renameLoading,
  renameValue,
  renamingCategory,
  setCategories,
  setNewCategoryName,
  setRenameValue,
  startRenameCategory,
}) {
  const hideCategoryFromLocalList = (category) => {
    const confirmed = window.confirm(
      `'${category}' 카테고리를 화면 목록에서 숨길까요?\n\n이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다. 나중에 같은 이름으로 카테고리를 다시 추가하면 목록에 다시 보입니다.`
    );
    if (!confirmed) return;
    setCategories(categories.filter((currentCategory) => currentCategory !== category));
  };

  const addCategoryToLocalList = () => {
    if (!newCategoryName || categories.includes(newCategoryName)) return;
    setCategories([...categories, newCategoryName]);
    setNewCategoryName('');
  };

  return (
    <div className="mb-3 p-2 bg-white rounded border border-indigo-200 shadow-inner">
      <div className="flex gap-1 mb-2">
        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="새 카테고리명" className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded" aria-label="새 화면 카테고리 이름" />
        <button
          type="button"
          onClick={addCategoryToLocalList}
          className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold whitespace-nowrap"
          title="화면 카테고리 추가"
          aria-label="화면 카테고리 추가"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          renamingCategory === cat ? (
            <span key={cat} className="inline-flex items-center gap-1 px-1 py-0.5 bg-white border border-indigo-300 rounded ring-1 ring-indigo-200">
              <input
                autoFocus
                type="text"
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') confirmRenameCategory(); if (e.key === 'Escape') cancelRenameCategory(); }}
                className="text-[10px] px-1 py-0.5 w-16 border border-slate-200 rounded outline-none"
                title="변경할 Cloud 태그 이름 입력"
                aria-label={`${cat} Cloud 태그 새 이름`}
              />
              <button
                type="button"
                onClick={confirmRenameCategory}
                disabled={renameLoading}
                className="text-emerald-600 hover:text-emerald-800"
                title="Cloud 태그 이름 변경 저장"
                aria-label={`${cat} Cloud 태그 이름 변경 저장`}
              >
                {renameLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
              </button>
              <button
                type="button"
                onClick={cancelRenameCategory}
                className="text-slate-400 hover:text-slate-600"
                title="태그 이름 변경 취소"
                aria-label={`${cat} 태그 이름 변경 취소`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ) : (
            <span key={cat} className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">
              {cat}
              <button
                type="button"
                onClick={() => startRenameCategory(cat)}
                className="text-indigo-400 hover:text-indigo-600"
                title="Cloud 태그 이름 변경 - 이 태그가 붙은 모든 채널에 일괄 반영됩니다"
                aria-label={`${cat} Cloud 태그 이름 변경`}
              >
                <Settings className="w-2.5 h-2.5" />
              </button>
              <button
                type="button"
                onClick={() => hideCategoryFromLocalList(cat)}
                className="text-red-400 hover:text-red-600"
                title="화면 목록에서만 숨깁니다. 이미 채널에 붙은 Cloud 태그는 삭제되지 않습니다."
                aria-label={`${cat} 카테고리를 화면 목록에서만 숨기기`}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </span>
          )
        ))}
      </div>
      <p className="text-[9px] text-slate-400 mt-1.5">⚙️ 이름 변경은 Cloud 태그를 바꿉니다. 휴지통은 화면 목록에서만 숨기며, 이미 채널에 붙은 Cloud 태그는 삭제하지 않습니다.</p>
      {cloudOnlyTags.length > 0 && (
        <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50 p-2 text-[10px] leading-relaxed text-amber-800">
          <p className="font-bold">Cloud에는 있지만 화면 목록에는 없는 태그가 있습니다.</p>
          <p className="mt-1 font-semibold">{cloudOnlyTags.slice(0, 4).join(', ')}{cloudOnlyTags.length > 4 ? ` 외 ${cloudOnlyTags.length - 4}개` : ''}</p>
          <p className="mt-1 text-amber-700">카테고리를 지워도 Cloud 채널 태그는 삭제되지 않습니다. 다시 보려면 같은 이름으로 카테고리를 추가하세요.</p>
        </div>
      )}
    </div>
  );
}
