import { Bookmark, Database } from 'lucide-react';

export default function RadarCandidateEmptyState({
  onLoadStoredVideos,
  onOpenVault,
  selectedChannelCount = 0,
}) {
  const hasSelectedChannels = selectedChannelCount > 0;
  const loadStoredVideosTitle = hasSelectedChannels
    ? `DB 조회: 선택 채널 ${selectedChannelCount}개의 저장된 영상을 불러옵니다. YouTube API를 새로 호출하지 않습니다.`
    : '왼쪽 채널 목록에서 볼 채널을 먼저 체크해야 저장 영상을 불러올 수 있습니다. 이 버튼은 DB 조회용이며 YouTube API를 새로 호출하지 않습니다.';
  const loadStoredVideosAriaLabel = hasSelectedChannels
    ? `선택 채널 ${selectedChannelCount}개 저장 영상 불러오기, DB 조회이며 YouTube API 호출 없음`
    : '채널 선택 필요, 왼쪽 채널 목록에서 볼 채널을 먼저 체크하세요';

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
            disabled={!hasSelectedChannels}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold ${
              hasSelectedChannels
                ? 'bg-blue-500 text-white hover:bg-blue-400'
                : 'cursor-not-allowed bg-slate-800 text-slate-500'
            }`}
            title={loadStoredVideosTitle}
            aria-label={loadStoredVideosAriaLabel}
          >
            <Database className="h-4 w-4" /> {hasSelectedChannels ? '저장 영상 불러오기' : '채널 선택 필요'}
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
