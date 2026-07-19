import { ArrowRight, CheckCircle2 } from 'lucide-react';
import StoredVideoLoadFeedback from './StoredVideoLoadFeedback';

export default function ChannelWatchlistNextStep({
  loadResult,
  loading = false,
  onOpenRadar,
  onOpenSelectedScan,
  onRetry,
}) {
  if (!loadResult) return null;

  const videoCount = Math.max(0, Number(loadResult.videoCount) || 0);

  if (loadResult.success !== true || videoCount === 0) {
    return (
      <div className="mt-4">
        <StoredVideoLoadFeedback
          loadResult={loadResult}
          loading={loading}
          onOpenSelectedScan={onOpenSelectedScan}
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <section
      aria-label="저장 영상 불러오기 다음 단계"
      className="mt-4 flex flex-col gap-3 border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
        <div>
          <p className="text-sm font-extrabold text-white">저장 영상 {videoCount}개 불러오기 완료</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            다음 단계에서 오늘 우선 검토할 영상을 판단하세요.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenRadar}
        className="inline-flex shrink-0 items-center justify-center gap-2 bg-emerald-300 px-4 py-2.5 text-xs font-extrabold text-emerald-950 hover:bg-emerald-200"
        title="오늘의 레이더로 이동합니다. 이동만으로 API 호출이나 데이터 변경은 실행되지 않습니다."
      >
        다음: 오늘의 레이더 보기
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
}
