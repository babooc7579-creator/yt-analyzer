import { useMemo, useState } from 'react';

import {
  KEYWORD_EXPLORER_RESULT_LIMIT,
  filterKeywordExplorerVideos,
  getKeywordExplorerSummary,
  getKeywordSuggestions,
} from '../utils/keywordExplorer';

export function useKeywordExplorerState({ videos }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [lengthFilter, setLengthFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [minimumViews, setMinimumViews] = useState(0);
  const [sortType, setSortType] = useState('relevance');

  const matchedVideos = useMemo(() => filterKeywordExplorerVideos({
    ageFilter,
    lengthFilter,
    minimumViews,
    searchQuery,
    sortType,
    videos,
  }), [ageFilter, lengthFilter, minimumViews, searchQuery, sortType, videos]);

  const displayedVideos = matchedVideos.slice(0, KEYWORD_EXPLORER_RESULT_LIMIT);
  const suggestions = useMemo(() => getKeywordSuggestions(videos), [videos]);
  const summary = useMemo(() => getKeywordExplorerSummary({
    matchedVideos,
    shownVideoCount: displayedVideos.length,
    videos,
  }), [displayedVideos.length, matchedVideos, videos]);

  const hasQuery = Boolean(searchQuery.trim());
  const hasActiveFilters = Boolean(
    hasQuery
    || lengthFilter !== 'all'
    || ageFilter !== 'all'
    || Number(minimumViews) > 0,
  );

  const resetFilters = () => {
    setSearchQuery('');
    setLengthFilter('all');
    setAgeFilter('all');
    setMinimumViews(0);
    setSortType('relevance');
  };

  return {
    ageFilter,
    displayedVideos,
    hasActiveFilters,
    hasQuery,
    lengthFilter,
    matchedVideos,
    minimumViews,
    resetFilters,
    searchQuery,
    setAgeFilter,
    setLengthFilter,
    setMinimumViews,
    setSearchQuery,
    setSortType,
    sortType,
    suggestions,
    summary,
  };
}
