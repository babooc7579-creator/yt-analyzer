import { Loader2 } from 'lucide-react';
import { getChannelPreviewInputCopy } from '../utils/channelAddCopy';

export default function ChannelPreviewInput({
  handlePreviewChannel,
  newChannelInput,
  previewLoading,
  setNewChannelInput,
}) {
  const hasInput = Boolean(newChannelInput?.trim());
  const copy = getChannelPreviewInputCopy({ hasInput });

  return (
    <div className="space-y-1.5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={newChannelInput}
          onChange={(event) => setNewChannelInput(event.target.value)}
          placeholder={copy.inputPlaceholder}
          className="min-w-0 w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
          aria-label={copy.inputAriaLabel}
          title={copy.inputTitle}
          onKeyDown={(event) => event.key === 'Enter' && handlePreviewChannel()}
        />
        <button
          type="button"
          onClick={handlePreviewChannel}
          disabled={previewLoading || !hasInput}
          className="flex w-full items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:bg-slate-300 sm:w-auto"
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
