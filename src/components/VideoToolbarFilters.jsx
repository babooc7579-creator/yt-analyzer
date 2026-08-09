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
    <div className="flex flex-wrap items-center gap-3 w-full">
      <VideoToolbarSearchField {...searchFieldProps} />

      <VideoToolbarSelectFilters {...selectFiltersProps} />

      <VideoToolbarSortControl {...sortControlProps} />

      <VideoToolbarViewModeControl {...viewModeControlProps} />

      <VideoToolbarWorkPanelToggle {...workPanelToggleProps} />

      <VideoToolbarFilterStatus {...statusProps} />
    </div>
  );
}
