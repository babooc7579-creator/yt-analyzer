export const getVideoToolbarViewProps = ({
  activeSelectedChannelCount,
  filteredCount,
  filteredVideoUrlList,
  handleManualScan,
  isScanning,
  lengthFilter,
  scannableChannelCount,
  searchKeyword,
  selectedChannelCount,
  setLengthFilter,
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
}) => {
  const scanTargetCount = selectedChannelCount > 0
    ? activeSelectedChannelCount
    : scannableChannelCount;

  return {
    filtersProps: {
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
    },
    referenceHeaderProps: {
      filteredCount,
      filteredVideoUrlList,
      totalCount,
    },
    scanActionProps: {
      handleManualScan,
      isScanning,
      scanTargetCount,
      selectedChannelCount,
    },
    ttoTtoButtonProps: {
      setTtoTtoMode,
      ttoTtoMode,
    },
  };
};
