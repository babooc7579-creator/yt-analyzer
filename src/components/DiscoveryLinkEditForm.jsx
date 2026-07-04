import { Save, X } from 'lucide-react';

export default function DiscoveryLinkEditForm({
  draftMemo,
  draftTitle,
  linkId,
  onCancel,
  onSave,
  saving,
  setDraftMemo,
  setDraftTitle,
  title,
}) {
  return (
    <div className="mt-3 space-y-3">
      <div>
        <label
          className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
          htmlFor={`discovery-title-${linkId}`}
        >
          제목
        </label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 outline-none transition focus:border-indigo-400"
          disabled={saving}
          id={`discovery-title-${linkId}`}
          onChange={(event) => setDraftTitle(event.target.value)}
          placeholder="나중에 알아볼 수 있는 이름"
          value={draftTitle}
          aria-label={`${title} 발견 링크 제목 수정`}
        />
      </div>

      <div>
        <label
          className="text-[11px] font-extrabold uppercase tracking-wide text-slate-500"
          htmlFor={`discovery-memo-${linkId}`}
        >
          메모
        </label>
        <textarea
          className="mt-1 min-h-24 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 outline-none transition focus:border-indigo-400"
          disabled={saving}
          id={`discovery-memo-${linkId}`}
          onChange={(event) => setDraftMemo(event.target.value)}
          placeholder="왜 저장했는지, 어떤 포인트를 봐야 하는지 적어두세요."
          value={draftMemo}
          aria-label={`${title} 발견 링크 메모 수정`}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 text-xs font-extrabold text-white transition hover:bg-indigo-500 disabled:bg-slate-300"
          disabled={saving}
          onClick={onSave}
          title="제목과 메모를 Cloud 발견함에 저장"
          aria-label={`${title} 제목과 메모 저장`}
          type="button"
        >
          <Save className="h-4 w-4" />
          저장
        </button>
        <button
          className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-extrabold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
          disabled={saving}
          onClick={onCancel}
          title="수정 취소"
          aria-label={`${title} 수정 취소`}
          type="button"
        >
          <X className="h-4 w-4" />
          취소
        </button>
      </div>
    </div>
  );
}
