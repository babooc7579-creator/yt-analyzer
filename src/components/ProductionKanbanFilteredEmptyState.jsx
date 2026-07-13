import { SearchX } from 'lucide-react';

export default function ProductionKanbanFilteredEmptyState({ onReset }) {
  return (
    <div className="border border-dashed border-slate-300 bg-white p-8 text-center">
      <SearchX className="mx-auto h-10 w-10 text-slate-300" />
      <h3 className="mt-3 text-sm font-extrabold text-slate-800">조건에 맞는 제작 작업이 없습니다</h3>
      <p className="mt-1 text-xs text-slate-500">검색어나 진행 단계를 바꾸면 기존 Cloud 작업 기록을 다시 볼 수 있습니다.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-slate-900 px-4 text-xs font-extrabold text-white hover:bg-slate-700"
      >
        전체 작업 보기
      </button>
    </div>
  );
}
