import { CheckCircle2, Sparkles } from 'lucide-react';

export default function LegacyWorkPanelIntro({ apiKey, onChangeApiKey }) {
  return (
    <>
      <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-indigo-600" /> 타임머신 CRM
      </h1>
      <div className="mb-4 border border-indigo-100 bg-indigo-50/60 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          <div>
            <p className="text-sm font-extrabold text-slate-900">오늘의 작업 흐름</p>
            <p className="text-[11px] text-slate-500">채널 저장 → 새 영상 수집 → 저장된 영상 확인</p>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="bg-white border border-indigo-100 rounded-lg p-3">
            <p className="text-xs font-bold text-slate-800">1. 먼저 채널 저장</p>
            <p className="text-[11px] text-slate-500 mt-1">소재를 모을 유튜브 채널을 클라우드 목록에 추가합니다.</p>
          </div>
          <div className="bg-white border border-emerald-100 rounded-lg p-3">
            <p className="text-xs font-bold text-emerald-700">2. 유튜브 새 영상 수집</p>
            <p className="text-[11px] text-slate-500 mt-1">YouTube API를 호출해 새 영상 여부를 확인합니다.</p>
          </div>
          <div className="bg-white border border-blue-100 rounded-lg p-3">
            <p className="text-xs font-bold text-blue-700">3. 저장된 영상 불러오기</p>
            <p className="text-[11px] text-slate-500 mt-1">이미 저장된 데이터만 조회합니다. 새 API 호출은 없습니다.</p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onChangeApiKey(e.target.value)}
          placeholder="YouTube API Key (댓글 스캔에만 필요)"
          className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>
    </>
  );
}
