import VideoToolbarToggleButton from './VideoToolbarToggleButton';

const SORT_OPTIONS = [
  {
    value: 'multiplier',
    label: '대박지수',
    title: '대박 지수 높은 순으로 정렬',
    ariaLabel: '대박 지수 높은 순 정렬',
    activeClassName: 'text-indigo-700',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-bold',
  },
  {
    value: 'viral',
    label: '화제성(일평균)',
    title: '일평균 조회 반응이 높은 순으로 정렬',
    ariaLabel: '화제성 높은 순 정렬',
    activeClassName: 'text-orange-600',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
  {
    value: 'date',
    label: '최신순',
    title: '업로드 최신순으로 정렬',
    ariaLabel: '최신순 정렬',
    activeClassName: 'text-slate-800',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
  {
    value: 'likes',
    label: '참여율(좋아요)',
    title: '참여율 높은 순으로 정렬',
    ariaLabel: '참여율 높은 순 정렬',
    activeClassName: 'text-rose-600',
    inactiveClassName: 'text-slate-500 hover:text-slate-800',
    fontClassName: 'font-semibold',
  },
];

export default function VideoToolbarSortControl({ setSortType, sortType }) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
      {SORT_OPTIONS.map((option) => (
        <VideoToolbarToggleButton
          key={option.value}
          activeClassName={option.activeClassName}
          ariaLabel={option.ariaLabel}
          fontClassName={option.fontClassName}
          inactiveClassName={option.inactiveClassName}
          isActive={sortType === option.value}
          label={option.label}
          onClick={() => setSortType(option.value)}
          title={option.title}
        />
      ))}
    </div>
  );
}
