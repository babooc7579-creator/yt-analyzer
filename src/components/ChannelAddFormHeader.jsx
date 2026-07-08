import { Settings } from 'lucide-react';

import { getChannelAddFormHeaderCopy } from '../utils/channelAddCopy';

export default function ChannelAddFormHeader({
  addMode,
  channelPreview,
  isEditingCategory,
  setAddMode,
  setIsEditingCategory,
}) {
  const copy = getChannelAddFormHeaderCopy();

  return (
    <div className="flex justify-between items-center mb-2">
      <label className="text-xs font-bold text-indigo-800 block">{copy.label}</label>
      <div className="flex items-center gap-2">
        {!channelPreview && (
          <div className="flex bg-white rounded-md border border-indigo-200 overflow-hidden text-[10px] font-bold">
            {copy.modeButtons.map((button) => (
              <button
                key={button.mode}
                type="button"
                onClick={() => setAddMode(button.mode)}
                className={`px-2 py-1 transition-colors ${addMode === button.mode ? 'bg-indigo-600 text-white' : 'text-indigo-500 hover:bg-indigo-50'}`}
                title={button.title}
                aria-label={button.ariaLabel}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsEditingCategory(!isEditingCategory)}
          className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-semibold whitespace-nowrap"
          title={copy.categoryButtonProps.title}
          aria-label={copy.categoryButtonProps.ariaLabel}
        >
          <Settings className="w-3 h-3" /> {copy.categoryButtonProps.label}
        </button>
      </div>
    </div>
  );
}
