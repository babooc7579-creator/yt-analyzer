import { getVideoToolbarFiltersViewProps } from '../utils/videoToolbarFiltersProps';
import VideoToolbarSearchField from './VideoToolbarSearchField';
import VideoToolbarSelectFilters from './VideoToolbarSelectFilters';
import VideoToolbarSortControl from './VideoToolbarSortControl';
import VideoToolbarViewModeControl from './VideoToolbarViewModeControl';
import VideoToolbarWorkPanelToggle from './VideoToolbarWorkPanelToggle';
import VideoToolbarFilterStatus from './VideoToolbarFilterStatus';

export default function VideoToolbarFilters({
  lengthFilter,
  onResetFilters,
  quickFilter,
  searchKeyword,
  selectedVideoCount,
  setLengthFilter,
  setQuickFilter,
  setSearchKeyword,
  setShowWorkPanel,
  setSortType,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
  ttoTtoMode,
  viewFilter,
  viewMode,
}) {
  const {
    searchFieldProps,
    selectFiltersProps,
    sortControlProps,
    statusProps,
    viewModeControlProps,
    workPanelToggleProps,
  } = getVideoToolbarFiltersViewProps({
    lengthFilter,
    onResetFilters,
    quickFilter,
    searchKeyword,
    selectedVideoCount,
    setLengthFilter,
    setQuickFilter,
    setSearchKeyword,
    setShowWorkPanel,
    setSortType,
    setViewFilter,
    setViewMode,
    showWorkPanel,
    sortType,
    ttoTtoMode,
    viewFilter,
    viewMode,
  });

  return (
    <div className="grid w-full grid-cols-1 gap-3">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(14rem,1fr)_auto_auto]" aria-label="수집 영상 기본 필터">
        <VideoToolbarSearchField {...searchFieldProps} />
        <VideoToolbarSelectFilters {...selectFiltersProps} />
      </div>

      <div aria-label="수집 영상 정렬">
        <VideoToolbarSortControl {...sortControlProps} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center" aria-label="수집 영상 보기와 선택 상태">
        <div className="flex flex-wrap items-center gap-2">
          <VideoToolbarViewModeControl {...viewModeControlProps} />
          <VideoToolbarWorkPanelToggle {...workPanelToggleProps} />
        </div>
        <VideoToolbarFilterStatus {...statusProps} />
      </div>
    </div>
  );
}
