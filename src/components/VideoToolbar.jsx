import React from 'react';
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

  return (
    <div className="bg-slate-100 rounded-2xl shadow-sm border border-slate-300 p-4 flex flex-col 2xl:flex-row gap-4 justify-between items-stretch z-20">
      <div className="flex flex-col gap-3 min-w-0 flex-1">
        {isReferenceVaultView && (
          <VideoToolbarReferenceHeader
            filteredCount={filteredCount}
            filteredVideoUrlList={filteredVideoUrlList}
            totalCount={totalCount}
          />
        )}
        <VideoToolbarFilters
          lengthFilter={lengthFilter}
          searchKeyword={searchKeyword}
          setLengthFilter={setLengthFilter}
          setSearchKeyword={setSearchKeyword}
          setShowWorkPanel={setShowWorkPanel}
          setSortType={setSortType}
          setViewFilter={setViewFilter}
          setViewMode={setViewMode}
          showWorkPanel={showWorkPanel}
          sortType={sortType}
          viewFilter={viewFilter}
          viewMode={viewMode}
        />
      </div>

      <VideoToolbarScanAction
        handleManualScan={handleManualScan}
        isScanning={isScanning}
        scanTargetCount={scanTargetCount}
        selectedChannelCount={selectedChannelCount}
      />

      <VideoToolbarTtoTtoButton setTtoTtoMode={setTtoTtoMode} ttoTtoMode={ttoTtoMode} />
    </div>
  );
}
