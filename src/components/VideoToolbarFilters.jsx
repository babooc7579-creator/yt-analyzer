import VideoToolbarSearchField from './VideoToolbarSearchField';
import VideoToolbarSelectFilters from './VideoToolbarSelectFilters';
import VideoToolbarSortControl from './VideoToolbarSortControl';
import VideoToolbarViewModeControl from './VideoToolbarViewModeControl';
import VideoToolbarWorkPanelToggle from './VideoToolbarWorkPanelToggle';

export default function VideoToolbarFilters({
  lengthFilter,
  searchKeyword,
  setLengthFilter,
  setSearchKeyword,
  setShowWorkPanel,
  setSortType,
  setViewFilter,
  setViewMode,
  showWorkPanel,
  sortType,
  viewFilter,
  viewMode,
}) {
  const searchFieldProps = {
    searchKeyword,
    setSearchKeyword,
  };

  const selectFiltersProps = {
    lengthFilter,
    setLengthFilter,
    setViewFilter,
    viewFilter,
  };

  const sortControlProps = {
    setSortType,
    sortType,
  };

  const viewModeControlProps = {
    setViewMode,
    viewMode,
  };

  const workPanelToggleProps = {
    setShowWorkPanel,
    showWorkPanel,
  };

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <VideoToolbarSearchField {...searchFieldProps} />

      <VideoToolbarSelectFilters {...selectFiltersProps} />

      <VideoToolbarSortControl {...sortControlProps} />

      <VideoToolbarViewModeControl {...viewModeControlProps} />

      <VideoToolbarWorkPanelToggle {...workPanelToggleProps} />
    </div>
  );
}
