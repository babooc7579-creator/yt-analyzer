import { BookOpen, Database, Loader2, Search } from 'lucide-react';

export default function KeywordExplorerHeader({
  loading = false,
  onLoadStoredVideos,
  onOpenVault,
  selectedChannelCount,
}) {
  return (
    <header className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-300">
            <Search className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-extrabold text-cyan-300">저장 영상 기반 소재 검색</p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">키워드 탐색</h2>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
          이미 Cloud에 저장된 영상의 제목과 채널명만 검색합니다. 검색·필터·정렬만으로 YouTube API를 새로 호출하지 않습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenVault}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 text-xs font-extrabold text-slate-200 hover:bg-slate-800"
          title="저장 영상 화면으로 이동합니다. 이동만으로 API 호출이나 데이터 변경은 없습니다."
        >
          <BookOpen className="h-4 w-4" /> 저장 영상 화면
        </button>
        <button
          type="button"
          onClick={onLoadStoredVideos}
          disabled={selectedChannelCount === 0 || loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-300 px-3 text-xs font-black text-slate-950 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          title={selectedChannelCount > 0
            ? `선택한 채널 ${selectedChannelCount}개의 저장 영상을 Cloud DB에서 조회합니다. YouTube API는 호출하지 않습니다.`
            : '먼저 오늘 볼 채널 또는 채널 목록에서 채널을 선택하세요.'}
        >
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Database className="h-4 w-4" />}
          {loading ? '저장 영상 불러오는 중...' : '저장 영상 불러오기'}
        </button>
      </div>
    </header>
  );
}
