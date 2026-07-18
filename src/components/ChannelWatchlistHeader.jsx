import { Database, Play, RefreshCw, Rocket, ScanSearch } from 'lucide-react';

export default function ChannelWatchlistHeader({
  channelsLoading,
  onLoadStoredVideos,
  onOpenStoredVideos,
  onOpenSelectedScan,
  onOpenTtoTto,
  onRefreshChannels,
  selectedChannelCount,
  storedVideoLoadPending = false,
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-800 pb-5 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className="text-xs font-extrabold text-cyan-200">오늘의 채널 점검</p>
        <h2 className="mt-2 text-2xl font-black text-white">오늘 볼 채널</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
          운영중 채널을 등급과 마지막 확인일로 정렬합니다. 채널을 고르는 것만으로 수집은 실행되지 않습니다.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onRefreshChannels}
          disabled={channelsLoading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-extrabold text-slate-200 hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
          title="Cloud DB에서 채널 목록만 다시 조회합니다. YouTube API 호출은 없습니다."
        >
          <RefreshCw className={`h-4 w-4 ${channelsLoading ? 'animate-spin' : ''}`} />
          {channelsLoading ? '채널 조회 중' : '채널 새로고침'}
        </button>
        <button
          type="button"
          onClick={onLoadStoredVideos}
          disabled={selectedChannelCount === 0 || storedVideoLoadPending}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-xs font-extrabold text-blue-950 hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500"
          title={selectedChannelCount > 0
            ? `선택 채널 ${selectedChannelCount}개의 저장 영상을 Cloud DB에서 조회합니다. 완료되면 다음 단계 버튼이 표시됩니다. YouTube API 호출은 없습니다.`
            : '먼저 오늘 볼 채널을 선택하세요.'}
        >
          {storedVideoLoadPending
            ? <RefreshCw className="h-4 w-4 animate-spin" />
            : <Database className="h-4 w-4" />}
          {storedVideoLoadPending ? '저장 영상 불러오는 중...' : '선택 채널 저장 영상 불러오기'}
        </button>
        <button
          type="button"
          onClick={onOpenSelectedScan}
          className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-extrabold text-emerald-100 hover:bg-emerald-500/20"
          title="선택 채널 새 영상 수집 화면으로 이동합니다. 이동만으로 수집은 실행되지 않으며, 실제 실행 시 YouTube API를 사용할 수 있습니다."
        >
          <ScanSearch className="h-4 w-4" /> 새 영상 수집 화면
        </button>
        <button
          type="button"
          onClick={onOpenStoredVideos}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-extrabold text-slate-200 hover:border-blue-400 hover:text-white"
          title="현재 앱에 불러온 저장 영상 전체 보기로 이동합니다. 조회나 YouTube API 호출은 실행하지 않습니다."
        >
          <Play className="h-4 w-4" /> 저장 영상 전체 보기
        </button>
        <button
          type="button"
          onClick={onOpenTtoTto}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-500/10 px-3 py-2 text-xs font-extrabold text-amber-100 hover:bg-amber-500/20"
          title="현재 앱에 불러온 영상에서 터또터 후보를 탐색하는 화면으로 이동합니다. 이동만으로 API 호출은 실행되지 않습니다."
        >
          <Rocket className="h-4 w-4" /> 터또터 탐색
        </button>
      </div>
    </header>
  );
}
