import { Bookmark, Lightbulb } from 'lucide-react';

export default function ScrapbookHeader({
  savedVideoCount,
  onCopyPrompt,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-yellow-500 fill-yellow-500" /> 영구 보관 스크랩북
        </h2>
        <p className="text-sm text-slate-500 mt-1">별표로 모아둔 나만의 영감 보관소입니다. Cloud 기준으로 보관하고, 연결 실패 시에만 브라우저 임시 기록을 안내합니다.</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <button onClick={onCopyPrompt} disabled={savedVideoCount === 0} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm ${savedVideoCount > 0 ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:shadow-md hover:scale-105' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`} type="button">
          <Lightbulb className="w-5 h-5" /> AI 리메이크 프롬프트 복사
        </button>
        <p className="max-w-[260px] text-right text-[10px] text-slate-500">스크랩한 영상 전체로 리메이크 요청문을 만들어 클립보드에 복사합니다.</p>
      </div>
    </div>
  );
}
