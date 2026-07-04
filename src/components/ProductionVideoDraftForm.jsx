import { Loader2, Save } from 'lucide-react';
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
        disabled={!isDirty || isSaving}
        className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-[11px] font-extrabold transition-colors ${isDirty && !isSaving ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
        title={isDirty ? '제목, 메모, 업로드 예정일을 Cloud 판단 기록에 저장' : 'Cloud에 저장된 상태'}
        aria-label={`${videoTitle} 제작 메모 저장`}
      >
        {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
        {isSaving ? '저장 중...' : isDirty ? '변경 내용 저장' : '저장됨'}
      </button>
      <ProductionVideoSaveStatus saveState={saveState} />
    </div>
  );
}
