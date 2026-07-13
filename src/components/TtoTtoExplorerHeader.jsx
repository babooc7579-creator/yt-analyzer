import { Bookmark, Database, ListTodo, Sparkles } from 'lucide-react';

export default function TtoTtoExplorerHeader({
  onOpenProductionCandidates,
  onOpenScrapbook,
  onOpenVault,
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 xl:flex-row xl:items-end xl:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-rose-200">
          <Sparkles className="h-5 w-5" />
          <p className="text-xs font-extrabold">저장 영상 기반 소재 발굴</p>
        </div>
        <h2 className="mt-2 text-2xl font-black text-white">터또터 탐색</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          6개월 이상 지났고 채널 평균보다 1.5배 이상 반응한 저장 영상을 찾습니다. 성공 예측이 아니라 다시 검토할 소재를 좁히는 판단 보조 신호입니다.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-400/20 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-100">
          <Database className="h-4 w-4" />
          Cloud DB에 이미 저장된 영상만 사용하며, 화면을 여는 것만으로 YouTube API를 호출하지 않습니다.
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-extrabold text-slate-200 hover:border-slate-500 hover:text-white"
          title="저장 영상 화면으로 이동합니다. 이동만으로 YouTube API를 호출하지 않습니다."
        >
          <Database className="h-4 w-4" /> 저장 영상
        </button>
        <button
          type="button"
          onClick={onOpenScrapbook}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-extrabold text-slate-200 hover:border-slate-500 hover:text-white"
          title="Cloud 스크랩북으로 이동합니다."
        >
          <Bookmark className="h-4 w-4" /> 스크랩북
        </button>
        <button
          type="button"
          onClick={onOpenProductionCandidates}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-3 py-2 text-xs font-extrabold text-white hover:bg-indigo-400"
          title="Cloud 판단 기록의 제작 후보함으로 이동합니다."
        >
          <ListTodo className="h-4 w-4" /> 제작 후보함
        </button>
      </div>
    </header>
  );
}
