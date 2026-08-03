import { useMemo, useState } from 'react';

import {
  KEYWORD_EXPLORER_RESULT_LIMIT,
  filterKeywordExplorerVideos,
  getKeywordExplorerSummary,
  getKeywordSuggestions,
} from '../utils/keywordExplorer';
import { annotateSimilarTopicVideos, getSimilarTopicGroups } from '../utils/similarTopics';

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

  const topicGroups = useMemo(() => getSimilarTopicGroups(matchedVideos), [matchedVideos]);
  const displayedVideos = useMemo(() => annotateSimilarTopicVideos(
    matchedVideos.slice(0, KEYWORD_EXPLORER_RESULT_LIMIT),
    topicGroups,
  ), [matchedVideos, topicGroups]);
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
    topicGroups,
  };
}
