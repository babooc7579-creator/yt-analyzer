import { Loader2, Play } from 'lucide-react';

export default function LoadStoredVideosButton({
  loading,
  selectedChannelCount,
  onLoad,
}) {
  const hasSelectedChannels = selectedChannelCount > 0;
  const buttonLabel = loading
    ? 'Cloud DB에서 저장 영상 불러오는 중'
    : hasSelectedChannels
      ? `선택 채널 저장 영상 불러오기 (${selectedChannelCount}개)`
      : '채널 선택 후 저장 영상 불러오기';

  const helperTitle = hasSelectedChannels
    ? 'DB 조회: 선택 채널 저장 영상 불러오기'
    : '채널 선택 필요';
  const helperDescription = hasSelectedChannels
    ? '이미 Cloud DB에 저장된 영상만 조회합니다. YouTube API를 새로 호출하지 않습니다.'
    : '왼쪽 채널 목록에서 볼 채널을 체크하면 버튼이 활성화됩니다. 새 영상 수집은 실행하지 않습니다.';

  return (
    <>
      <button
        type="button"
        onClick={onLoad}
        disabled={loading || !hasSelectedChannels}
        title={helperDescription}
        aria-label={buttonLabel}
        className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${loading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : hasSelectedChannels ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        {buttonLabel}
      </button>
      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
        <p className="text-[11px] font-bold text-blue-700">{helperTitle}</p>
        <p className="text-[10px] text-slate-600 mt-0.5">{helperDescription}</p>
      </div>
    </>
  );
}
