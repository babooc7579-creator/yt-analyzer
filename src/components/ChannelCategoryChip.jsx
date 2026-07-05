import { CheckCircle2, Loader2, Settings, Trash2, X } from 'lucide-react';
import { getChannelCategoryChipViewProps } from '../utils/channelCategoryChipProps';

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
  const {
    cancelButtonProps,
    confirmButtonProps,
    hideButtonProps,
    renameInputProps,
    startRenameButtonProps,
  } = getChannelCategoryChipViewProps({
    cancelRenameCategory,
    category,
    confirmRenameCategory,
    hideCategoryFromLocalList,
    renameLoading,
    renameValue,
    setRenameValue,
    startRenameCategory,
  });

  if (isRenaming) {
    return (
      <span className="inline-flex items-center gap-1 px-1 py-0.5 bg-white border border-indigo-300 rounded ring-1 ring-indigo-200">
        <input {...renameInputProps} />
        <button {...confirmButtonProps}>
          {renameLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <CheckCircle2 className="w-2.5 h-2.5" />}
        </button>
        <button {...cancelButtonProps}>
          <X className="w-2.5 h-2.5" />
        </button>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] text-slate-600">
      {category}
      <button {...startRenameButtonProps}>
        <Settings className="w-2.5 h-2.5" />
      </button>
      <button {...hideButtonProps}>
        <Trash2 className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}
