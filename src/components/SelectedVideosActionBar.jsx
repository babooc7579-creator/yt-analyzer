import { CheckCircle2, Copy } from 'lucide-react';

export default function SelectedVideosActionBar({
  selectedCount,
  copiedPrompt,
  onCopyPrompt,
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-indigo-900 rounded-xl p-4 flex justify-between items-center shadow-lg animate-in slide-in-from-top-4">
      <span className="text-indigo-100 font-medium text-sm"><span className="text-white font-bold text-lg">{selectedCount}</span>개 선택됨</span>
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={onCopyPrompt}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg font-bold shadow-md transition-transform hover:scale-105"
          title="AI API를 호출하지 않고 선택 영상 기반 요청문만 클립보드에 복사"
          aria-label={`선택 영상 ${selectedCount}개로 AI 리메이크 프롬프트 복사`}
          type="button"
        >
          {copiedPrompt ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          {copiedPrompt ? '복사 완료! AI에게 붙여넣으세요' : 'AI 리메이크 프롬프트 복사'}
        </button>
        <p className="text-[10px] text-indigo-100">AI API를 호출하지 않고, 선택 영상으로 만든 요청문만 클립보드에 복사합니다.</p>
      </div>
    </div>
  );
}
