import { Loader2, Save } from 'lucide-react';

import {
  getProductionVideoDraftSaveButtonProps,
  getProductionVideoDraftSaveHandler,
  getProductionVideoDraftStatusBadgeProps,
} from '../utils/productionVideoStatusProps';
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
  const videoId = video?.videoId;
  const hasSaveTarget = Boolean(videoId) && typeof onSave === 'function';
  const saveButtonProps = getProductionVideoDraftSaveButtonProps({
    hasSaveTarget,
    isDirty,
    isSaving,
    videoTitle,
  });
  const statusBadgeProps = getProductionVideoDraftStatusBadgeProps({
    isDirty,
    isSaving,
    saveState,
  });

  return (
    <div className="mt-3 space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-extrabold text-slate-500">2. 제작안 작성 · 온라인 저장소(Azure DB) 저장</p>
        {statusBadgeProps && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-extrabold ${statusBadgeProps.tone}`}
            title={statusBadgeProps.title}
          >
            {statusBadgeProps.label}
          </span>
        )}
      </div>
      <ProductionVideoDraftFields
        onUpdateDraft={onUpdateDraft}
        record={record}
        video={video}
        videoTitle={videoTitle}
      />
      <button
        type="button"
        onClick={getProductionVideoDraftSaveHandler({ onSave, videoId })}
        disabled={saveButtonProps.disabled}
        className={`inline-flex w-full items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors sm:w-auto ${saveButtonProps.disabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
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
