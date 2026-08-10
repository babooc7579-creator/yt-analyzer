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
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-300 bg-slate-100 p-4 shadow-sm 2xl:grid-cols-[minmax(0,1fr)_22rem] 2xl:items-start">
      <div className="flex min-w-0 flex-col gap-3">
        {isReferenceVaultView && (
          <VideoToolbarReferenceHeader {...referenceHeaderProps} />
        )}

        <VideoToolbarQuickFilters
          quickFilter={quickFilter}
          quickFilterCounts={quickFilterCounts}
          setQuickFilter={setQuickFilter}
          setSortType={setSortType}
          {...ttoTtoButtonProps}
        />

        <VideoToolbarFilters {...filtersProps} />
      </div>

      <VideoToolbarScanAction {...scanActionProps} />
    </div>
  );
}
