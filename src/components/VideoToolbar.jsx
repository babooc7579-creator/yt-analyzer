import React from 'react';
import { Rocket } from 'lucide-react';
import VideoToolbarFilters from './VideoToolbarFilters';
import VideoToolbarReferenceHeader from './VideoToolbarReferenceHeader';
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

      <button
        type="button"
        onClick={() => setTtoTtoMode(!ttoTtoMode)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold transition-all duration-300 shadow-sm ${ttoTtoMode ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-rose-200 ring-2 ring-rose-200 ring-offset-1 scale-105' : 'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'}`}
        title="6개월 이상 지난 또터또 후보 중심으로 보기"
        aria-label={ttoTtoMode ? '터또터 발굴 모드 끄기' : '터또터 발굴 모드 켜기'}
      >
        <Rocket className={`w-5 h-5 ${ttoTtoMode ? 'animate-bounce' : ''}`} />
        터또터 발굴 (6개월+)
      </button>
    </div>
  );
}
