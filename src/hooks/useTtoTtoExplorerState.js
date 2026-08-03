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
  const [ageFilter, setAgeFilter] = useState('all');

  const filteredCandidates = useMemo(() => filterAndSortTtoTtoCandidates({
    ageFilter,
    lengthFilter,
    minimumViews,
    searchQuery,
    sortType,
    videoUserRecords,
    videos,
  }), [ageFilter, lengthFilter, minimumViews, searchQuery, sortType, videoUserRecords, videos]);

  const dataModel = useMemo(() => getTtoTtoExplorerDataModel({
    filteredCandidates,
    videoUserRecords,
    videos,
  }), [filteredCandidates, videoUserRecords, videos]);

  const hasActiveFilters = Boolean(
    searchQuery.trim()
    || ageFilter !== 'all'
    || Number(minimumViews) > 0
    || lengthFilter !== 'all',
  );

  const resetFilters = () => {
    setSearchQuery('');
    setMinimumViews(0);
    setLengthFilter('all');
    setAgeFilter('all');
  };

  return {
    ...dataModel,
    ageFilter,
    filteredCandidates,
    hasActiveFilters,
    lengthFilter,
    minimumViews,
    resetFilters,
    searchQuery,
    setAgeFilter,
    setLengthFilter,
    setMinimumViews,
    setSearchQuery,
    setSortType,
    sortType,
  };
}
