import { AlertCircle, LoaderCircle, X } from 'lucide-react';

export default function CreatorActionFeedback({
  error,
  onClearError,
  progressMessage,
}) {
  if (error) {
    return (
      <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-500/15 px-4 py-3 text-red-50 shadow-sm">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-200" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold text-red-100">작업을 완료하지 못했습니다</p>
          <p className="mt-1 text-xs font-semibold leading-relaxed text-red-50">{error}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-red-100/80">
            앱 화면은 열려 있어도 Microsoft 로그인 세션이 만료될 수 있습니다. 계속 실패하면 페이지를 새로고침해 다시 로그인한 뒤 시도해 주세요.
          </p>
        </div>
        {typeof onClearError === 'function' && (
          <button
            type="button"
            onClick={onClearError}
            title="오류 안내 닫기"
            aria-label="오류 안내 닫기"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-red-100/70 hover:bg-red-400/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  if (!progressMessage) return null;

  return (
    <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-xl border border-blue-400/35 bg-blue-500/15 px-4 py-3 text-blue-50 shadow-sm">
      <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-blue-200" />
      <div className="min-w-0">
        <p className="text-xs font-extrabold text-blue-100">현재 작업 상태</p>
        <p className="mt-1 text-xs font-semibold leading-relaxed text-blue-50">{progressMessage}</p>
      </div>
    </div>
  );
}
