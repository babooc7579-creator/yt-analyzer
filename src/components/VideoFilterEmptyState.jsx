import { Filter } from 'lucide-react';

export default function VideoFilterEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
      <div className="mx-auto max-w-xl text-center bg-white border border-dashed border-slate-200 rounded-2xl p-8 shadow-sm">
        <Filter className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <p className="text-base font-bold text-slate-700">필터 조건에 맞는 영상이 없습니다</p>
        <p className="text-sm text-slate-500 mt-2">필터를 낮추거나, 새 영상이 필요하면 “유튜브 새 영상 수집”을 실행해 주세요.</p>
      </div>
    </div>
  );
}
