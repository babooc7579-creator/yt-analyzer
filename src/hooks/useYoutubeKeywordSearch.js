import { useEffect, useMemo, useState } from 'react';
import { searchYoutubeVideos } from '../services/youtubeSearchApi';
import {
  addYoutubeChannelRegistrationSelections,
  buildYoutubeSearchOptions,
  filterYoutubeSearchItemsForRequestedDuration,
  filterYoutubeSearchResults,
  toggleYoutubeChannelRegistrationSelection,
} from '../utils/youtubeKeywordSearch';

const INITIAL_FILTERS = {
  query: '',
  regionCode: '',
  language: '',
  dateRange: '30',
  duration: '',
  minimumViews: 0,
  order: 'relevance',
};

export function useYoutubeKeywordSearch({ initialState, onStateChange } = {}) {
  const [filters, setFilters] = useState(() => ({ ...INITIAL_FILTERS, ...initialState?.filters }));
  const [items, setItems] = useState(() => initialState?.items || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(initialState?.notice || '');
  const [nextPageToken, setNextPageToken] = useState(initialState?.nextPageToken || '');
  const [selectedIds, setSelectedIds] = useState(() => initialState?.selectedIds || []);
  const [lastQuery, setLastQuery] = useState(initialState?.lastQuery || '');
  const [appliedFilters, setAppliedFilters] = useState(() => initialState?.appliedFilters || null);
  const [channelRegistrationFilter, setChannelRegistrationFilter] = useState(() => initialState?.channelRegistrationFilter || 'all');
  const [titleScriptFilter, setTitleScriptFilter] = useState(() => initialState?.titleScriptFilter || 'all');
  const [resultSort, setResultSort] = useState(() => initialState?.resultSort || 'received');
  const [channelRegistrationIds, setChannelRegistrationIds] = useState(() => initialState?.channelRegistrationIds || []);
  const [shortsConfidenceFilter, setShortsConfidenceFilter] = useState(() => initialState?.shortsConfidenceFilter || 'all');

  useEffect(() => {
    onStateChange?.({ appliedFilters, channelRegistrationFilter, channelRegistrationIds, filters, items, lastQuery, nextPageToken, notice, resultSort, selectedIds, shortsConfidenceFilter, titleScriptFilter });
  }, [appliedFilters, channelRegistrationFilter, channelRegistrationIds, filters, items, lastQuery, nextPageToken, notice, onStateChange, resultSort, selectedIds, shortsConfidenceFilter, titleScriptFilter]);

  const displayedItems = useMemo(
    () => filterYoutubeSearchResults(items, filters.minimumViews, shortsConfidenceFilter),
    [filters.minimumViews, items, shortsConfidenceFilter],
  );

  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    if (key === 'duration' && value !== 'shorts') setShortsConfidenceFilter('all');
    if (key !== 'minimumViews') setNextPageToken('');
  };

  const runSearch = async ({ append = false } = {}) => {
    const requestFilters = append && appliedFilters ? appliedFilters : filters;
    const query = String(requestFilters.query || '').trim();
    if (!query) {
      setError('찾고 싶은 영상의 검색 키워드를 입력해 주세요.');
      return false;
    }
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const searchOptions = buildYoutubeSearchOptions(requestFilters, append ? nextPageToken : '');
      const data = await searchYoutubeVideos(searchOptions);
      if (!data?.success) throw new Error(data?.error || 'YouTube 검색 결과를 불러오지 못했습니다.');
      const apiItems = Array.isArray(data.items) ? data.items : [];
      const incoming = filterYoutubeSearchItemsForRequestedDuration(apiItems, requestFilters.duration);
      setItems((current) => {
        if (!append) return incoming;
        const merged = new Map(current.map((item) => [item.videoId, item]));
        incoming.forEach((item) => merged.set(item.videoId, item));
        return [...merged.values()];
      });
      if (!append) setSelectedIds([]);
      if (!append) setChannelRegistrationIds([]);
      if (!append) setAppliedFilters({ ...filters, query, publishedAfter: searchOptions.publishedAfter });
      setNextPageToken(data.nextPageToken || '');
      setLastQuery(query);
      setNotice(incoming.length > 0
        ? requestFilters.duration === 'shorts'
          ? `쇼츠 후보 ${incoming.length}개를 찾았습니다. 3분 이하 길이 기준이며 결과는 아직 저장되지 않았습니다.`
          : `${incoming.length}개 영상을 찾았습니다. 결과는 아직 저장되지 않았습니다.`
        : requestFilters.duration === 'shorts'
          ? '현재 받아온 4분 미만 검색 결과에는 3분 이하 쇼츠 후보가 없습니다. 다음 결과를 확인하거나 조건을 넓혀 보세요.'
          : '조건에 맞는 영상을 찾지 못했습니다.');
      return true;
    } catch (searchError) {
      setError(searchError.message || 'YouTube 검색 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSelected = (videoId) => {
    setSelectedIds((current) => current.includes(videoId)
      ? current.filter((id) => id !== videoId)
      : [...current, videoId]);
  };

  const clearSelected = () => setSelectedIds([]);
  const clearResults = () => {
    setItems([]);
    setSelectedIds([]);
    setChannelRegistrationIds([]);
    setNextPageToken('');
    setLastQuery('');
    setAppliedFilters(null);
    setChannelRegistrationFilter('all');
    setTitleScriptFilter('all');
    setShortsConfidenceFilter('all');
    setResultSort('received');
    setError('');
    setNotice('임시 영상 검색 결과를 지웠습니다. 입력한 검색 조건은 그대로 유지됩니다.');
  };
  const removeSelected = (videoIds) => {
    const removedIds = new Set(videoIds);
    setSelectedIds((current) => current.filter((id) => !removedIds.has(id)));
  };

  return {
    appliedFilters,
    addChannelRegistrationIds: (channelIds) => {
      setChannelRegistrationIds((current) => {
        const result = addYoutubeChannelRegistrationSelections(current, channelIds);
        setNotice(result.limitReached
          ? '중요 채널 후보 50개를 선택했습니다. 나머지 채널은 현재 후보에 포함하지 않았습니다.'
          : `중요 채널 후보 ${result.ids.length}개를 선택했습니다.`);
        return result.ids;
      });
    },
    channelRegistrationFilter,
    channelRegistrationIds,
    changeChannelRegistrationFilter: setChannelRegistrationFilter,
    changeTitleScriptFilter: setTitleScriptFilter,
    changeFilter,
    clearResults,
    clearChannelRegistrationIds: () => setChannelRegistrationIds([]),
    clearSelected,
    displayedItems,
    error,
    filters,
    items,
    lastQuery,
    loading,
    nextPageToken,
    notice,
    removeSelected,
    resetResultView: () => {
      setChannelRegistrationFilter('all');
      setTitleScriptFilter('all');
      setResultSort('received');
      setShortsConfidenceFilter('all');
    },
    resultSort,
    runSearch,
    selectedIds,
    shortsConfidenceFilter,
    changeShortsConfidenceFilter: setShortsConfidenceFilter,
    setNotice,
    toggleSelected,
    toggleChannelRegistration: (channelId) => {
      setChannelRegistrationIds((current) => {
        const result = toggleYoutubeChannelRegistrationSelection(current, channelId);
        if (result.limitReached) setNotice('중요 채널 후보는 한 번에 최대 50개까지 선택할 수 있습니다.');
        return result.ids;
      });
    },
    titleScriptFilter,
    changeResultSort: setResultSort,
  };
}
