import { useMemo, useState } from 'react';
import { filterAndSortVideos } from '../utils/video';

export function useVideoExplorerState(videos) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [viewFilter, setViewFilter] = useState(0);
  const [lengthFilter, setLengthFilter] = useState('all');
  const [ttoTtoMode, setTtoTtoMode] = useState(false);
  const [sortType, setSortType] = useState('multiplier');
  const [viewMode, setViewMode] = useState('card');

  const filteredAndSortedVideos = useMemo(() => (
    filterAndSortVideos({
      videos,
      searchKeyword,
      viewFilter,
      lengthFilter,
      ttoTtoMode,
      sortType,
    })
  ), [videos, searchKeyword, viewFilter, lengthFilter, ttoTtoMode, sortType]);

  return {
    filteredAndSortedVideos,
    lengthFilter,
    searchKeyword,
    setLengthFilter,
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
