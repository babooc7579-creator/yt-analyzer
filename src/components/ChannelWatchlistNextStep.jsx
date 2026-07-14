import { ArrowRight, CheckCircle2, ScanSearch } from 'lucide-react';

export default function ChannelWatchlistNextStep({
  loadResult,
  onOpenRadar,
  onOpenSelectedScan,
}) {
  if (!loadResult?.success) return null;

  const videoCount = Math.max(0, Number(loadResult.videoCount) || 0);
  const hasVideos = videoCount > 0;

  return (
    <section
      aria-label="저장 영상 불러오기 다음 단계"
      className={`mt-4 flex flex-col gap-3 border px-4 py-3 sm:flex-row sm:items-center sm:justify-between ${
        hasVideos
          ? 'border-emerald-400/40 bg-emerald-500/10'
          : 'border-amber-400/40 bg-amber-500/10'
      }`}
    >
      <div className="flex items-start gap-3">
        {hasVideos ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
        ) : (
          <ScanSearch className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
        )}
        <div>
          <p className="text-sm font-extrabold text-white">
            {hasVideos ? `저장 영상 ${videoCount}개 불러오기 완료` : '선택 채널에 저장된 영상이 없습니다'}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {hasVideos
              ? '다음 단계에서 오늘 우선 검토할 영상을 판단하세요.'
              : '필요하면 새 영상 수집 화면에서 YouTube API를 사용하는 수집 작업을 실행하세요.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={hasVideos ? onOpenRadar : onOpenSelectedScan}
        className={`inline-flex shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-xs font-extrabold ${
          hasVideos
            ? 'bg-emerald-300 text-emerald-950 hover:bg-emerald-200'
            : 'bg-amber-300 text-amber-950 hover:bg-amber-200'
        }`}
        title={hasVideos
          ? '오늘의 레이더로 이동합니다. 이동만으로 API 호출이나 데이터 변경은 실행되지 않습니다.'
          : '새 영상 수집 화면으로 이동합니다. 이동만으로 YouTube API 호출은 실행되지 않습니다.'}
      >
        {hasVideos ? '다음: 오늘의 레이더 보기' : '다음: 새 영상 수집 화면'}
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}
