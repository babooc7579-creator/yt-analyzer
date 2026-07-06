import { AlertTriangle, CheckCircle2, Copy } from 'lucide-react';

export default function SelectedVideosActionBar({
  selectedCount,
  copiedPrompt,
  promptCopyError,
  onCopyPrompt,
}) {
  if (selectedCount === 0) return null;
  const buttonLabel = promptCopyError
    ? '복사 실패 - 다시 시도'
    : copiedPrompt
      ? '복사 완료! AI에게 붙여넣으세요'
      : 'AI 요청문 복사';
  const helpText = promptCopyError
    ? '브라우저가 클립보드 복사를 막았습니다. 다시 누르거나 브라우저 권한을 확인해 주세요.'
    : 'AI API를 호출하지 않고, 선택 영상으로 만든 요청문만 클립보드에 복사합니다.';

  return (
    <div className="bg-indigo-900 rounded-xl p-4 flex justify-between items-center shadow-lg animate-in slide-in-from-top-4">
      <span className="text-indigo-100 font-medium text-sm"><span className="text-white font-bold text-lg">{selectedCount}</span>개 선택됨</span>
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={onCopyPrompt}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg font-bold shadow-md transition-transform hover:scale-105"
          title="AI API를 호출하지 않고 선택 영상 기반 요청문만 클립보드에 복사"
          aria-label={`선택 영상 ${selectedCount}개: ${buttonLabel}`}
          type="button"
        >
          {promptCopyError ? <AlertTriangle className="w-5 h-5" /> : copiedPrompt ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {buttonLabel}
        </button>
        <p className="text-[10px] text-indigo-100" aria-live="polite">
          {helpText}
        </p>
      </div>
    </div>
  );
}
