import { Loader2, Play } from 'lucide-react';

export default function LoadStoredVideosButton({
  loading,
  selectedChannelCount,
  onLoad,
}) {
  return (
    <>
      <button
        onClick={onLoad}
        disabled={loading || selectedChannelCount === 0}
        className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${loading ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : selectedChannelCount > 0 ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' : 'bg-slate-100 text-slate-400'}`}
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
        {loading ? '저장된 영상 불러오는 중...' : `저장된 영상 불러오기 (${selectedChannelCount}개 채널)`}
      </button>
      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
        <p className="text-[11px] font-bold text-blue-700">저장된 영상 불러오기</p>
        <p className="text-[10px] text-slate-600 mt-0.5">이미 수집되어 저장된 영상만 조회합니다. 유튜브 API를 새로 호출하지 않습니다.</p>
      </div>
    </>
  );
}
