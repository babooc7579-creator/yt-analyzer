import { Loader2, Plus } from 'lucide-react';
import { getChannelBulkSubmitButtonCopy } from '../utils/channelAddCopy';

export default function ChannelBulkSubmitButton({
  bulkInput,
  bulkLoading,
  handleBulkAdd,
}) {
  const copy = getChannelBulkSubmitButtonCopy({ bulkLoading });

  return (
    <button
      type="button"
      onClick={handleBulkAdd}
      disabled={bulkLoading || !bulkInput.trim()}
      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg text-sm font-semibold transition-colors"
      title={copy.title}
      aria-label={copy.ariaLabel}
    >
      {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
      {copy.label}
    </button>
  );
}
