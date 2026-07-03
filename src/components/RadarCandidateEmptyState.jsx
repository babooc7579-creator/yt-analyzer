import { Bookmark } from 'lucide-react';

export default function RadarCandidateEmptyState({ onOpenVault }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-5">
      <p className="text-sm font-extrabold text-white">오늘 볼 후보</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">아직 화면에 불러온 영상이 없습니다. 저장된 영상을 불러오면 여기에서 오늘 먼저 볼 후보를 보여줍니다.</p>
      <button
        type="button"
        onClick={onOpenVault}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-200 hover:bg-blue-500/15"
        title="저장된 영상 조회 화면으로 이동"
        aria-label="저장된 영상 조회 화면으로 이동"
      >
        <Bookmark className="h-4 w-4" /> 레퍼런스 금고 열기
      </button>
    </div>
  );
}
