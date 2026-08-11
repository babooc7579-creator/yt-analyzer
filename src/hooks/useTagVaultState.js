import { useEffect, useMemo, useState } from 'react';

import {
  TAG_VAULT_RESULT_LIMIT,
  filterTagVaultVideos,
  getTagVaultFacets,
  getTagVaultSummary,
} from '../utils/tagVault';

export function useTagVaultState({ channels, selectedChannelIds, videos }) {
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [lengthFilter, setLengthFilter] = useState('all');
  const [sortType, setSortType] = useState('multiplier');
  const [visibleCount, setVisibleCount] = useState(TAG_VAULT_RESULT_LIMIT);

  const facets = useMemo(() => getTagVaultFacets(channels), [channels]);
  const effectiveTag = facets.some((facet) => facet.label === selectedTag)
    ? selectedTag
    : facets[0]?.label || '';
  const selectedFacet = facets.find((facet) => facet.label === effectiveTag) || null;
  const matchedVideos = useMemo(() => filterTagVaultVideos({
    channels,
    lengthFilter,
    searchQuery,
    selectedTag: effectiveTag,
    sortType,
    videos,
  }), [channels, effectiveTag, lengthFilter, searchQuery, sortType, videos]);
  const displayedVideos = matchedVideos.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(TAG_VAULT_RESULT_LIMIT);
  }, [effectiveTag, lengthFilter, searchQuery, sortType, videos]);
  const summary = useMemo(() => getTagVaultSummary({
    channels,
    matchedVideos,
    selectedChannelIds,
    selectedTag: effectiveTag,
    shownVideoCount: displayedVideos.length,
    videos,
  }), [channels, displayedVideos.length, effectiveTag, matchedVideos, selectedChannelIds, videos]);
  const hasActiveFilters = Boolean(searchQuery.trim() || lengthFilter !== 'all');

  const resetFilters = () => {
    setSearchQuery('');
    setLengthFilter('all');
    setSortType('multiplier');
  };
  const showMoreVideos = () => {
    setVisibleCount((current) => Math.min(
      current + TAG_VAULT_RESULT_LIMIT,
      matchedVideos.length,
    ));
  };

  return {
    displayedVideos,
    effectiveTag,
    facets,
    hasActiveFilters,
    lengthFilter,
    matchedVideos,
    resetFilters,
    searchQuery,
    selectedFacet,
    setLengthFilter,
    setSearchQuery,
    setSelectedTag,
    setSortType,
    showMoreVideos,
    sortType,
    summary,
  };
}
