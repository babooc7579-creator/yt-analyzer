import { Plus } from 'lucide-react';

export default function ChannelCategoryAddInput({
  onAddCategory,
  newCategoryName,
  setNewCategoryName,
}) {
  return (
    <div className="flex gap-1 mb-2">
      <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="새 카테고리명" className="w-full text-xs px-2 py-1.5 border border-slate-200 rounded" aria-label="새 화면 카테고리 이름" />
      <button
        type="button"
        onClick={onAddCategory}
        className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold whitespace-nowrap"
        title="화면 카테고리 추가"
        aria-label="화면 카테고리 추가"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
