import { getVideoToolbarSortControlOptions } from '../utils/videoToolbarFiltersProps';
import VideoToolbarToggleButton from './VideoToolbarToggleButton';

export default function VideoToolbarSortControl({ setSortType, sortType }) {
  const sortOptions = getVideoToolbarSortControlOptions();

  return (
    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
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
  );
}
