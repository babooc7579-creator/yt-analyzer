import { useEffect, useMemo, useState } from 'react';

import {
  KEYWORD_EXPLORER_RESULT_LIMIT,
  filterKeywordExplorerVideos,
  getKeywordExplorerSummary,
  getKeywordSuggestions,
} from '../utils/keywordExplorer';
import { annotateSimilarTopicVideos, filterVideosByTopicGroup, getSimilarTopicGroups } from '../utils/similarTopics';

export function useKeywordExplorerState({ videos }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [lengthFilter, setLengthFilter] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [minimumViews, setMinimumViews] = useState(0);
  const [sortType, setSortType] = useState('relevance');
  const [selectedTopicGroupId, setSelectedTopicGroupId] = useState('');

  const matchedVideos = useMemo(() => filterKeywordExplorerVideos({
    ageFilter,
    lengthFilter,
    minimumViews,
    searchQuery,
    sortType,
    videos,
  }), [ageFilter, lengthFilter, minimumViews, searchQuery, sortType, videos]);

  useEffect(() => {
    setSelectedTopicGroupId('');
  }, [ageFilter, lengthFilter, minimumViews, searchQuery, sortType]);

  const topicGroups = useMemo(() => getSimilarTopicGroups(matchedVideos), [matchedVideos]);
  const activeTopicGroupId = topicGroups.some((group) => group.id === selectedTopicGroupId)
    ? selectedTopicGroupId
    : '';
  const topicFilteredVideos = useMemo(() => filterVideosByTopicGroup(
    matchedVideos,
    topicGroups,
    activeTopicGroupId,
  ), [activeTopicGroupId, matchedVideos, topicGroups]);
  const displayedVideos = useMemo(() => annotateSimilarTopicVideos(
    topicFilteredVideos.slice(0, KEYWORD_EXPLORER_RESULT_LIMIT),
    topicGroups,
  ), [topicFilteredVideos, topicGroups]);
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
    setSelectedTopicGroupId('');
  };

  return {
    ageFilter,
    activeTopicGroupId,
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
    setSelectedTopicGroupId,
    setSortType,
    sortType,
    suggestions,
    summary,
    topicGroups,
  };
}
