import { useEffect, useMemo, useState } from 'react';

import {
  CHANNEL_WATCH_PAGE_SIZE,
  filterAndSortChannelWatchlist,
  getChannelWatchTagOptions,
  getChannelWatchlistSummary,
} from '../utils/channelWatchlist';

export function useChannelWatchlistState({
  channels,
  selectedChannelIds,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [scanFilter, setScanFilter] = useState('all');
  const [selectionFilter, setSelectionFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(CHANNEL_WATCH_PAGE_SIZE);

  const tagOptions = useMemo(() => getChannelWatchTagOptions(channels), [channels]);

  const filteredChannels = useMemo(() => filterAndSortChannelWatchlist({
    channels,
    gradeFilter,
    scanFilter,
    searchQuery,
    selectedChannelIds,
    selectionFilter,
    tagFilter,
  }), [channels, gradeFilter, scanFilter, searchQuery, selectedChannelIds, selectionFilter, tagFilter]);

  useEffect(() => {
    setVisibleCount(CHANNEL_WATCH_PAGE_SIZE);
  }, [gradeFilter, scanFilter, searchQuery, selectionFilter, tagFilter]);

  useEffect(() => {
    if (tagFilter !== 'all' && !tagOptions.some((option) => option.value === tagFilter)) {
      setTagFilter('all');
    }
  }, [tagFilter, tagOptions]);

  const summary = useMemo(() => getChannelWatchlistSummary({
    channels,
    filteredChannels,
    selectedChannelIds,
  }), [channels, filteredChannels, selectedChannelIds]);

  const hasActiveFilters = Boolean(
    searchQuery.trim()
    || gradeFilter !== 'all'
    || scanFilter !== 'all'
    || selectionFilter !== 'all'
    || tagFilter !== 'all',
  );

  const resetFilters = () => {
    setSearchQuery('');
    setGradeFilter('all');
    setScanFilter('all');
    setSelectionFilter('all');
    setTagFilter('all');
  };

  return {
    filteredChannels,
    gradeFilter,
    hasActiveFilters,
    resetFilters,
    scanFilter,
    searchQuery,
    selectionFilter,
    setGradeFilter,
    setScanFilter,
    setSearchQuery,
    setSelectionFilter,
    setTagFilter,
    summary,
    tagFilter,
    tagOptions,
    visibleChannels: filteredChannels.slice(0, visibleCount),
    showMoreChannels: () => setVisibleCount((count) => count + CHANNEL_WATCH_PAGE_SIZE),
  };
}
