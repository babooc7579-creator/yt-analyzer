import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function VideoToolbarScanResultFeedback({
  feedback,
  onOpenRecentScanStatus,
}) {
  if (!feedback) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-3 rounded-xl border border-emerald-300 bg-white px-3 py-3 text-left shadow-sm"
    >
      <div className="flex items-start gap-2">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-emerald-900">{feedback.title}</p>
          <p className="mt-1 text-sm font-black leading-5 text-slate-900">{feedback.statsText}</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-600">{feedback.detail}</p>
        </div>
      </div>

      {typeof onOpenRecentScanStatus === 'function' ? (
        <button
          type="button"
          onClick={onOpenRecentScanStatus}
          title="최근 수집 상태 화면을 엽니다. 화면 이동만 하며 YouTube API를 다시 호출하지 않습니다."
          aria-label="최근 수집 상태에서 자세히 보기, 화면 이동만 하며 YouTube API 재호출 없음"
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-900 transition-colors hover:bg-emerald-100 sm:w-auto"
        >
          최근 수집 상태에서 자세히 보기
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
