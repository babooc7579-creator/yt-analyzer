import { getVideoToolbarViewProps } from '../utils/videoToolbarProps';
import VideoToolbarFilters from './VideoToolbarFilters';
import VideoToolbarReferenceHeader from './VideoToolbarReferenceHeader';
import VideoToolbarQuickFilters from './VideoToolbarQuickFilters';
import VideoToolbarScanAction from './VideoToolbarScanAction';

export default function VideoToolbar({
  isReferenceVaultView,
  filteredCount,
  filteredVideoUrlList,
  totalCount,
  searchKeyword,
  setSearchKeyword,
  viewFilter,
  setViewFilter,
  lengthFilter,
  quickFilter,
  quickFilterCounts,
  onResetFilters,
  selectedVideoCount,
  setLengthFilter,
  setQuickFilter,
  sortType,
  setSortType,
  viewMode,
  setViewMode,
  showWorkPanel,
  setShowWorkPanel,
  isScanning,
  selectedChannelCount,
  activeSelectedChannelCount,
  scannableChannelCount,
  handleManualScan,
  onOpenRecentScanStatus,
  ttoTtoMode,
  setTtoTtoMode,
}) {
  const {
    filtersProps,
    referenceHeaderProps,
    scanActionProps,
    ttoTtoButtonProps,
  } = getVideoToolbarViewProps({
    activeSelectedChannelCount,
    filteredCount,
    filteredVideoUrlList,
    handleManualScan,
    isScanning,
    lengthFilter,
    quickFilter,
    onResetFilters,
    onOpenRecentScanStatus,
    scannableChannelCount,
    searchKeyword,
    selectedVideoCount,
    selectedChannelCount,
    setLengthFilter,
    setQuickFilter,
    setSearchKeyword,
    setShowWorkPanel,
    setSortType,
    setTtoTtoMode,
    setViewFilter,
    setViewMode,
    showWorkPanel,
    sortType,
    totalCount,
    ttoTtoMode,
    viewFilter,
    viewMode,
  });

  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-4 flex flex-col 2xl:flex-row gap-4 justify-between items-stretch z-20">
      <div className="flex flex-col gap-3 min-w-0 flex-1">
        {isReferenceVaultView && (
          <VideoToolbarReferenceHeader {...referenceHeaderProps} />
        )}
        <VideoToolbarFilters {...filtersProps} />
      </div>

      <VideoToolbarScanAction {...scanActionProps} />

      <VideoToolbarQuickFilters
        quickFilter={quickFilter}
        quickFilterCounts={quickFilterCounts}
        setQuickFilter={setQuickFilter}
        setSortType={setSortType}
        {...ttoTtoButtonProps}
      />
    </div>
  );
}
