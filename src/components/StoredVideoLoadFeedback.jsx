import { AlertTriangle, ListChecks, RefreshCw, ScanSearch } from 'lucide-react';

export default function StoredVideoLoadFeedback({
  loadResult,
  loading = false,
  onOpenChannelWatchlist,
  onOpenSelectedScan,
  onRetry,
}) {
  if (!loadResult || loadResult.success === true && Number(loadResult.videoCount) > 0) {
    return null;
  }

  const failed = loadResult.success !== true;

  return (
    <section
      aria-label={failed ? '저장 영상 불러오기 실패' : '저장 영상 0개 다음 행동'}
      className={`border px-4 py-4 ${
        failed
          ? 'border-rose-400/35 bg-rose-500/10'
          : 'border-amber-400/35 bg-amber-500/10'
      }`}
    >
      <div className="flex items-start gap-3">
        {failed ? (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
        ) : (
          <ScanSearch className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        )}
        <div>
          <h3 className="text-sm font-extrabold text-white">
            {failed
              ? 'Cloud 저장 영상을 불러오지 못했습니다'
              : '조회는 정상 완료됐지만 저장된 영상이 없습니다'}
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-300">
            {failed
              ? '연결 상태를 확인한 뒤 같은 자리에서 다시 시도하세요. 실패한 작업은 YouTube API를 호출하지 않았습니다.'
              : '다른 채널을 고르거나 새 영상 수집 준비 화면으로 이동하세요. 화면 이동만으로 YouTube API를 호출하지 않습니다.'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {failed ? (
          <button
            type="button"
            aria-label="Cloud 저장 영상 다시 불러오기"
            onClick={onRetry}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-rose-200 px-4 py-2.5 text-xs font-extrabold text-rose-950 hover:bg-rose-100 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            title="Cloud DB 저장 영상 조회를 다시 시도합니다. YouTube API를 호출하지 않습니다."
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? '다시 불러오는 중...' : '다시 불러오기'}
          </button>
        ) : (
          <>
            <button
              type="button"
              aria-label="오늘 볼 채널에서 다른 채널 고르기"
              onClick={onOpenChannelWatchlist}
              className="inline-flex items-center gap-2 bg-amber-200 px-4 py-2.5 text-xs font-extrabold text-amber-950 hover:bg-amber-100"
              title="오늘 볼 채널 화면으로 이동합니다. 이동만으로 YouTube API를 호출하지 않습니다."
            >
              <ListChecks className="h-4 w-4" /> 다른 채널 고르기
            </button>
            <button
              type="button"
              aria-label="선택 채널 새 영상 수집 준비 화면 열기"
              onClick={onOpenSelectedScan}
              className="inline-flex items-center gap-2 border border-amber-300/30 bg-amber-500/10 px-4 py-2.5 text-xs font-extrabold text-amber-100 hover:bg-amber-500/20"
              title="새 영상 수집 준비 화면으로 이동합니다. 이동만으로 수집은 시작되지 않습니다."
            >
              <ScanSearch className="h-4 w-4" /> 새 영상 수집 준비
            </button>
          </>
        )}
      </div>
    </section>
  );
}
