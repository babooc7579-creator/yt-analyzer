import { useMemo, useState } from 'react';

import {
  filterAndSortTtoTtoCandidates,
  getTtoTtoExplorerDataModel,
} from '../utils/ttoTtoExplorer';

export function useTtoTtoExplorerState({
  videoUserRecords,
  videos,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minimumViews, setMinimumViews] = useState(0);
  const [lengthFilter, setLengthFilter] = useState('all');
  const [sortType, setSortType] = useState('priority');

  const filteredCandidates = useMemo(() => filterAndSortTtoTtoCandidates({
    lengthFilter,
    minimumViews,
    searchQuery,
    sortType,
    videoUserRecords,
    videos,
  }), [lengthFilter, minimumViews, searchQuery, sortType, videoUserRecords, videos]);

  const dataModel = useMemo(() => getTtoTtoExplorerDataModel({
    filteredCandidates,
    videoUserRecords,
    videos,
  }), [filteredCandidates, videoUserRecords, videos]);

  const hasActiveFilters = Boolean(
    searchQuery.trim()
    || Number(minimumViews) > 0
    || lengthFilter !== 'all',
  );

  const resetFilters = () => {
    setSearchQuery('');
    setMinimumViews(0);
    setLengthFilter('all');
  };

  return {
    ...dataModel,
    filteredCandidates,
    hasActiveFilters,
    lengthFilter,
    minimumViews,
    resetFilters,
    searchQuery,
    setLengthFilter,
    setMinimumViews,
    setSearchQuery,
    setSortType,
    sortType,
  };
}
