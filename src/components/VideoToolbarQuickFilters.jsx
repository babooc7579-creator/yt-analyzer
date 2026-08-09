import { Clock3, Flame } from 'lucide-react';

import VideoToolbarTtoTtoButton from './VideoToolbarTtoTtoButton';

const QUICK_FILTERS = [
  {
    id: 'recent30',
    label: '최근 30일',
    description: '업로드 후 30일 이내인 수집 영상 정보만 봅니다.',
    icon: Clock3,
    sortType: 'date',
  },
  {
    id: 'oldPopular',
    label: '오래된 인기',
    description: '6개월 이상 지났고 조회수 10만 이상인 수집 영상 정보만 봅니다.',
    icon: Flame,
    sortType: 'recommended',
  },
];

export default function VideoToolbarQuickFilters({
  quickFilter,
  quickFilterCounts = {},
  setQuickFilter,
  setSortType,
  setTtoTtoMode,
  ttoTtoMode,
}) {
  const getCountLabel = (filterId) => {
    const value = quickFilterCounts[filterId];
    return value !== null && value !== undefined && Number.isFinite(Number(value))
      ? Number(value)
      : '조회 전';
  };
  const selectQuickFilter = (filter) => {
    const nextFilter = quickFilter === filter.id ? 'all' : filter.id;
    setQuickFilter(nextFilter);
    if (nextFilter !== 'all') {
      setTtoTtoMode(false);
      setSortType(filter.sortType);
    }
  };

  const toggleTtoTtoMode = (nextMode) => {
    setTtoTtoMode(nextMode);
    if (nextMode) {
      setQuickFilter('all');
      setSortType('recommended');
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white/70 p-2 sm:flex-row sm:flex-wrap sm:items-center" aria-label="수집 영상 빠른 필터">
      <span className="px-1 text-[11px] font-black text-slate-500">빠른 보기</span>
      {QUICK_FILTERS.map((filter) => {
        const Icon = filter.icon;
        const isActive = quickFilter === filter.id;
        const countLabel = getCountLabel(filter.id);
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => selectQuickFilter(filter)}
            className={`inline-flex w-full items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-extrabold transition sm:w-auto ${isActive ? 'border-indigo-400 bg-indigo-100 text-indigo-800' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'}`}
            title={`${filter.description} 화면 필터와 정렬만 바꾸며 YouTube API를 호출하지 않습니다.`}
            aria-label={`${filter.label} 빠른 필터 ${isActive ? '해제' : '적용'}, 화면 표시만 변경, YouTube API 호출 없음`}
            aria-pressed={isActive}
          >
            <Icon className="h-3.5 w-3.5" />
            {filter.label}
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600" aria-label={`${filter.label} 대상 ${countLabel === '조회 전' ? countLabel : `${countLabel}개`}`}>
              {countLabel}
            </span>
          </button>
        );
      })}
      <div className="w-full sm:w-auto [&>button]:w-full sm:[&>button]:w-auto">
        <VideoToolbarTtoTtoButton
          count={getCountLabel('ttoTto')}
          setTtoTtoMode={toggleTtoTtoMode}
          ttoTtoMode={ttoTtoMode}
        />
      </div>
    </div>
  );
}
