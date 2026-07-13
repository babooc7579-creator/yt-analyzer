import { useMemo, useState } from 'react';

import {
  filterAndSortChannelWatchlist,
  getChannelWatchlistSummary,
} from '../utils/channelWatchlist';

export function useChannelWatchlistState({
  channels,
  selectedChannelIds,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [scanFilter, setScanFilter] = useState('all');

  const filteredChannels = useMemo(() => filterAndSortChannelWatchlist({
    channels,
    gradeFilter,
    scanFilter,
    searchQuery,
  }), [channels, gradeFilter, scanFilter, searchQuery]);

  const summary = useMemo(() => getChannelWatchlistSummary({
    channels,
    filteredChannels,
    selectedChannelIds,
  }), [channels, filteredChannels, selectedChannelIds]);

  const hasActiveFilters = Boolean(
    searchQuery.trim()
    || gradeFilter !== 'all'
    || scanFilter !== 'all',
  );

  const resetFilters = () => {
    setSearchQuery('');
    setGradeFilter('all');
    setScanFilter('all');
  };

  return {
    filteredChannels,
    gradeFilter,
    hasActiveFilters,
    resetFilters,
    scanFilter,
    searchQuery,
    setGradeFilter,
    setScanFilter,
    setSearchQuery,
    summary,
  };
}
