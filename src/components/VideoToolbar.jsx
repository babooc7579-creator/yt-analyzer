import VideoToolbarFilters from './VideoToolbarFilters';
import VideoToolbarReferenceHeader from './VideoToolbarReferenceHeader';
import VideoToolbarScanAction from './VideoToolbarScanAction';
import VideoToolbarTtoTtoButton from './VideoToolbarTtoTtoButton';

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
  setLengthFilter,
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
  ttoTtoMode,
  setTtoTtoMode,
}) {
  const scanTargetCount = selectedChannelCount > 0 ? activeSelectedChannelCount : scannableChannelCount;
  const referenceHeaderProps = {
    filteredCount,
    filteredVideoUrlList,
    totalCount,
  };

  const filtersProps = {
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
  };

  const scanActionProps = {
    handleManualScan,
    isScanning,
    scanTargetCount,
    selectedChannelCount,
  };

  const ttoTtoButtonProps = {
    setTtoTtoMode,
    ttoTtoMode,
  };

  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-4 flex flex-col 2xl:flex-row gap-4 justify-between items-stretch z-20">
      <div className="flex flex-col gap-3 min-w-0 flex-1">
        {isReferenceVaultView && (
          <VideoToolbarReferenceHeader {...referenceHeaderProps} />
        )}
        <VideoToolbarFilters {...filtersProps} />
      </div>

      <VideoToolbarScanAction {...scanActionProps} />

      <VideoToolbarTtoTtoButton {...ttoTtoButtonProps} />
    </div>
  );
}
