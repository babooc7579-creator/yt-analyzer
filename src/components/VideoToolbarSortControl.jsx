import { getVideoToolbarSortControlOptions } from '../utils/videoToolbarFiltersProps';
import VideoToolbarToggleButton from './VideoToolbarToggleButton';

export default function VideoToolbarSortControl({ setSortType, sortType }) {
  const sortOptions = getVideoToolbarSortControlOptions();

  return (
    <div className="w-full sm:w-auto">
      <div className="flex w-full flex-wrap rounded-lg border border-slate-200 bg-slate-100 p-1 sm:w-auto">
        {sortOptions.map((option) => (
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
      {sortType === 'recommended' ? (
        <p className="mt-1 px-1 text-[11px] font-semibold leading-relaxed text-emerald-700">
          추천 기준 · 또터또 후보 → 대박 지수 → 일평균 반응 → 조회수
        </p>
      ) : null}
    </div>
  );
}
