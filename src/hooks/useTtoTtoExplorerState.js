import { useEffect, useMemo, useState } from 'react';

import {
  filterAndSortTtoTtoCandidates,
  getTtoTtoExplorerDataModel,
} from '../utils/ttoTtoExplorer';
import { annotateSimilarTopicVideos, filterVideosByTopicGroup, getSimilarTopicGroups } from '../utils/similarTopics';

export function useTtoTtoExplorerState({
  videoUserRecords,
  videos,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [minimumViews, setMinimumViews] = useState(0);
  const [lengthFilter, setLengthFilter] = useState('all');
  const [sortType, setSortType] = useState('priority');
  const [ageFilter, setAgeFilter] = useState('all');
  const [selectedTopicGroupId, setSelectedTopicGroupId] = useState('');

  const filteredCandidates = useMemo(() => filterAndSortTtoTtoCandidates({
    ageFilter,
    lengthFilter,
    minimumViews,
    searchQuery,
    sortType,
    videoUserRecords,
    videos,
  }), [ageFilter, lengthFilter, minimumViews, searchQuery, sortType, videoUserRecords, videos]);

  useEffect(() => {
    setSelectedTopicGroupId('');
  }, [ageFilter, lengthFilter, minimumViews, searchQuery, sortType]);

  const dataModel = useMemo(() => getTtoTtoExplorerDataModel({
    filteredCandidates,
    videoUserRecords,
    videos,
  }), [filteredCandidates, videoUserRecords, videos]);
  const topicGroups = useMemo(() => getSimilarTopicGroups(filteredCandidates), [filteredCandidates]);
  const activeTopicGroupId = topicGroups.some((group) => group.id === selectedTopicGroupId)
    ? selectedTopicGroupId
    : '';
  const topicFilteredCandidates = useMemo(() => filterVideosByTopicGroup(
    filteredCandidates,
    topicGroups,
    activeTopicGroupId,
  ), [activeTopicGroupId, filteredCandidates, topicGroups]);
  const groupedCandidates = useMemo(() => annotateSimilarTopicVideos(
    topicFilteredCandidates,
    topicGroups,
  ), [topicFilteredCandidates, topicGroups]);

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
    setSelectedTopicGroupId('');
  };

  return {
    ...dataModel,
    activeTopicGroupId,
    ageFilter,
    filteredCandidates,
    groupedCandidates,
    hasActiveFilters,
    lengthFilter,
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
    topicGroups,
  };
}
