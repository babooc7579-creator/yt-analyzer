import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react';

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
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">내가 만들 제목</span>
        <input
          type="text"
          value={record.draftTitle || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { draftTitle: event.target.value })}
          placeholder="내 채널에 맞게 바꿀 제목 초안"
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-200"
          aria-label={`${videoTitle} 내가 만들 제목 입력`}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">메모</span>
        <textarea
          value={record.note || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { note: event.target.value })}
          placeholder="훅 포인트, 참고할 장면, 만들 방향"
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          aria-label={`${videoTitle} 제작 메모 입력`}
        />
      </label>
      <label className="block">
        <span className="text-[10px] font-extrabold text-slate-500">업로드 예정일</span>
        <input
          type="date"
          value={record.targetPublishDate || ''}
          onChange={(event) => onUpdateDraft(video.videoId, { targetPublishDate: event.target.value })}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-200"
          title="업로드 예정일 선택"
          aria-label={`${videoTitle} 업로드 예정일 선택`}
        />
      </label>
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
      {saveState === 'saved' && (
        <p className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
          <CheckCircle2 className="h-3 w-3" /> 클라우드에 저장됐습니다.
        </p>
      )}
      {saveState === 'error' && (
        <p className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600">
          <AlertCircle className="h-3 w-3" /> 저장 실패. 다시 저장해 주세요.
        </p>
      )}
    </div>
  );
}
