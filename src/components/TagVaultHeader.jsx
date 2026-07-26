import { Database, FolderOpen, Loader2, Tags } from 'lucide-react';

export default function TagVaultHeader({ loading = false, onLoadStoredVideos, onOpenChannels, selectedChannelCount }) {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
          <Tags className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-extrabold text-emerald-300">레퍼런스 금고</p>
          <h2 className="mt-1 text-xl font-black text-white">태그별 금고</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            채널에 이미 저장된 태그별로 Cloud 저장 영상을 묶어 봅니다. 태그 선택만으로 YouTube API를 호출하지 않습니다.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onOpenChannels}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-700 px-3 text-xs font-extrabold text-slate-200 hover:bg-slate-800"
          title="채널 목록 화면으로 이동합니다. 이동만으로 Cloud DB 조회나 YouTube API 호출은 실행되지 않습니다."
          aria-label="채널 목록 화면으로 이동, Cloud DB 조회 및 YouTube API 호출 없음"
        >
          <FolderOpen className="h-4 w-4" /> 채널 목록
        </button>
        <button
          type="button"
          onClick={onLoadStoredVideos}
          disabled={selectedChannelCount === 0 || loading}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-cyan-400 px-3 text-xs font-black text-slate-950 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
          title="선택된 채널의 영상을 Cloud DB에서 조회합니다. YouTube API를 호출하지 않습니다."
          aria-label={loading
            ? 'Cloud DB에서 저장 영상 불러오는 중, YouTube API 호출 없음'
            : `선택 채널 ${selectedChannelCount}개 저장 영상 불러오기, Cloud DB 조회이며 YouTube API 호출 없음`}
        >
          {loading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <Database className="h-4 w-4" />}
          {loading ? '저장 영상 불러오는 중...' : `저장 영상 불러오기 (${selectedChannelCount})`}
        </button>
      </div>
    </header>
  );
}
