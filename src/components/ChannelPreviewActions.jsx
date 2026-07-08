import { getChannelPreviewActionsCopy } from '../utils/channelAddCopy';

export default function ChannelPreviewActions({
  cancelChannelPreview,
  handleSaveChannel,
  loading,
}) {
  const copy = getChannelPreviewActionsCopy();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={cancelChannelPreview}
        className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold transition-colors"
        title={copy.cancelButtonTitle}
        aria-label={copy.cancelButtonAriaLabel}
      >
        {copy.cancelButtonLabel}
      </button>
      <button
        type="button"
        onClick={handleSaveChannel}
        disabled={loading}
        className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors"
        title={copy.saveButtonTitle}
        aria-label={copy.saveButtonAriaLabel}
      >
        {copy.saveButtonLabel}
      </button>
    </div>
  );
}
