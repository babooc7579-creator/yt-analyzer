import { Play, RefreshCw } from 'lucide-react';

export default function StoredVideoGuide() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
        <div className="flex items-start gap-4">
          <RefreshCw className="w-5 h-5 text-emerald-600 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-emerald-800">유튜브 새 영상 수집</p>
            <p className="text-xs text-slate-600 mt-1">YouTube API를 호출해 신규 영상을 확인합니다. 새 영상이 필요할 때만 실행하세요.</p>
          </div>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex items-start gap-4">
          <Play className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-extrabold text-blue-800">저장된 영상 불러오기</p>
            <p className="text-xs text-slate-600 mt-1">클라우드에 이미 저장된 영상만 조회합니다. YouTube API를 새로 호출하지 않습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
