export const getVideoToolbarFiltersViewProps = ({
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
}) => ({
  searchFieldProps: {
    searchKeyword,
    setSearchKeyword,
  },
  selectFiltersProps: {
    lengthFilter,
    setLengthFilter,
    setViewFilter,
    viewFilter,
  },
  sortControlProps: {
    setSortType,
    sortType,
  },
  viewModeControlProps: {
    setViewMode,
    viewMode,
  },
  workPanelToggleProps: {
    setShowWorkPanel,
    showWorkPanel,
  },
});
