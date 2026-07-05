import { Bookmark, Database } from 'lucide-react';

export default function RadarCandidateEmptyState({
  onLoadStoredVideos,
  onOpenVault,
}) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-950/70 p-5">
      <p className="text-sm font-extrabold text-white">오늘 볼 후보</p>
      <p className="mt-2 text-xs leading-relaxed text-slate-400">
        아직 화면에 불러온 영상이 없습니다. 선택한 채널의 저장된 영상을 불러오면 여기에서 오늘 먼저 볼 후보를 보여줍니다.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {onLoadStoredVideos && (
          <button
            type="button"
            onClick={onLoadStoredVideos}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-2 text-xs font-bold text-white hover:bg-blue-400"
            title="DB 조회: 선택 채널의 저장된 영상을 불러옵니다. YouTube API를 새로 호출하지 않습니다."
            aria-label="선택 채널 저장 영상 불러오기, DB 조회이며 YouTube API 호출 없음"
          >
            <Database className="h-4 w-4" /> 저장 영상 불러오기
          </button>
        )}
        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-200 hover:bg-blue-500/15"
          title="저장된 영상 조회 화면으로 이동"
          aria-label="저장된 영상 조회 화면으로 이동"
        >
          <Bookmark className="h-4 w-4" /> 레퍼런스 금고 열기
        </button>
      </div>
    </div>
  );
}
