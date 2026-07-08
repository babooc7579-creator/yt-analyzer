import { Loader2, Save } from 'lucide-react';

import { getProductionVideoDraftSaveButtonProps } from '../utils/productionVideoStatusProps';
import ProductionVideoDraftFields from './ProductionVideoDraftFields';
import ProductionVideoSaveStatus from './ProductionVideoSaveStatus';

export default function ProductionVideoDraftForm({
  isDirty,
  isSaving,
  onSave,
  onUpdateDraft,
  record,
  saveState,
  video,
  videoTitle,
}) {
  const saveButtonProps = getProductionVideoDraftSaveButtonProps({
    isDirty,
    isSaving,
    videoTitle,
  });

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <ProductionVideoDraftFields
        onUpdateDraft={onUpdateDraft}
        record={record}
        video={video}
        videoTitle={videoTitle}
      />
      <button
        type="button"
        onClick={() => onSave(video.videoId)}
        disabled={saveButtonProps.disabled}
        className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isDirty && !isSaving ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        title={saveButtonProps.title}
        aria-label={saveButtonProps.ariaLabel}
      >
        {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        {saveButtonProps.label}
      </button>
      <ProductionVideoSaveStatus saveState={saveState} />
    </div>
  );
}
