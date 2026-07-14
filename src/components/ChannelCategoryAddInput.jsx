import { Plus } from 'lucide-react';

import { getChannelCategoryAddInputViewProps } from '../utils/channelCategorySettingsProps';

export default function ChannelCategoryAddInput({
  onAddCategory,
  newCategoryName,
  setNewCategoryName,
}) {
  const {
    addButtonProps,
    inputAriaLabel,
    inputPlaceholder,
  } = getChannelCategoryAddInputViewProps();

  return (
    <div className="flex gap-1 mb-2">
      <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder={inputPlaceholder} className="w-full rounded border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400" aria-label={inputAriaLabel} />
      <button
        type="button"
        onClick={onAddCategory}
        className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-bold whitespace-nowrap"
        title={addButtonProps.title}
        aria-label={addButtonProps['aria-label']}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}
