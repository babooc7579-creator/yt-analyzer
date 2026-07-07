import { Loader2, Play } from 'lucide-react';

import { getLoadStoredVideosActionProps } from '../utils/loadStoredVideosActionProps';

export default function LoadStoredVideosButton({
  loading,
  selectedChannelCount,
  onLoad,
}) {
  const {
    buttonAriaLabel,
    buttonDisabled,
    buttonLabel,
    hasSelectedChannels,
    helperDescription,
    helperTitle,
    title,
  } = getLoadStoredVideosActionProps({
    loading,
    onLoad,
    selectedChannelCount,
  });

  return (
    <>
      <button
        type="button"
        onClick={onLoad}
        disabled={buttonDisabled}
        title={title}
        aria-label={buttonAriaLabel}
        className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${loading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : hasSelectedChannels ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        {buttonLabel}
      </button>
      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
        <p className="text-[11px] font-bold text-blue-700">{helperTitle}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">{helperDescription}</p>
      </div>
    </>
  );
}
