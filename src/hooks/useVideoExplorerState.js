import { useMemo, useState } from 'react';
import { filterAndSortVideos } from '../utils/video';

export function useVideoExplorerState(videos) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewFilter, setViewFilter] = useState(0);
  const [lengthFilter, setLengthFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [ttoTtoMode, setTtoTtoMode] = useState(false);
  const [sortType, setSortType] = useState('recommended');
  const [viewMode, setViewMode] = useState('card');

  const filteredAndSortedVideos = useMemo(() => (
    filterAndSortVideos({
      videos,
      searchKeyword,
      viewFilter,
      lengthFilter,
      quickFilter,
      ttoTtoMode,
      sortType,
    })
  ), [videos, searchKeyword, viewFilter, lengthFilter, quickFilter, ttoTtoMode, sortType]);

  return {
    filteredAndSortedVideos,
    lengthFilter,
    quickFilter,
    searchKeyword,
    setLengthFilter,
    setQuickFilter,
    setSearchKeyword,
    setSortType,
    setTtoTtoMode,
    setViewFilter,
    setViewMode,
    sortType,
    ttoTtoMode,
    viewFilter,
    viewMode,
  };
}
