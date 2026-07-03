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
  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      <VideoToolbarSearchField
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
      />

      <VideoToolbarSelectFilters
        lengthFilter={lengthFilter}
        setLengthFilter={setLengthFilter}
        setViewFilter={setViewFilter}
        viewFilter={viewFilter}
      />

      <VideoToolbarSortControl setSortType={setSortType} sortType={sortType} />

      <VideoToolbarViewModeControl setViewMode={setViewMode} viewMode={viewMode} />

      <VideoToolbarWorkPanelToggle
        setShowWorkPanel={setShowWorkPanel}
        showWorkPanel={showWorkPanel}
      />
    </div>
  );
}
