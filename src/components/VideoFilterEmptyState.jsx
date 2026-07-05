import { Filter } from 'lucide-react';

export default function VideoFilterEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
      <div className="mx-auto max-w-xl text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 shadow-sm">
        <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-base font-bold text-slate-700">필터 조건에 맞는 영상이 없습니다</p>
        <p className="text-sm text-slate-500 mt-2">검색어나 필터를 낮춰 보세요. 새 데이터가 필요할 때만 “선택 채널 새 영상 수집”을 실행합니다. 이 작업은 YouTube API를 호출할 수 있습니다.</p>
      </div>
    </div>
  );
}
