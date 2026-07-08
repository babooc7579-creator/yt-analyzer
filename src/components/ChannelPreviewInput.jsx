import { Loader2 } from 'lucide-react';
import { getChannelPreviewInputCopy } from '../utils/channelAddCopy';

export default function ChannelPreviewInput({
  handlePreviewChannel,
  newChannelInput,
  previewLoading,
  setNewChannelInput,
}) {
  const copy = getChannelPreviewInputCopy();

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={newChannelInput}
          onChange={(event) => setNewChannelInput(event.target.value)}
          placeholder={copy.inputPlaceholder}
          className="w-full text-sm px-3 py-2 border border-indigo-200 rounded-lg outline-none"
          aria-label={copy.inputAriaLabel}
          onKeyDown={(event) => event.key === 'Enter' && handlePreviewChannel()}
        />
        <button
          type="button"
          onClick={handlePreviewChannel}
          disabled={previewLoading}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap"
          title={copy.previewButtonTitle}
          aria-label={copy.previewButtonAriaLabel}
        >
          {previewLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {copy.previewButtonLabel}
        </button>
      </div>
      <p className="text-[10px] text-slate-500">{copy.helperText}</p>
    </div>
  );
}
