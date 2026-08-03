import { useEffect, useMemo, useState } from 'react';
import { searchYoutubeChannels } from '../services/youtubeSearchApi';
import {
  addYoutubeChannelRegistrationSelections,
  sortYoutubeChannelResults,
  toggleYoutubeChannelRegistrationSelection,
} from '../utils/youtubeKeywordSearch';

const INITIAL_FILTERS = {
  query: '',
  regionCode: '',
  language: '',
};

const INITIAL_VIEW_FILTERS = {
  registration: 'all',
  country: 'all',
  selection: 'all',
};

export function useYoutubeChannelSearch({ initialState, onStateChange } = {}) {
  const [filters, setFilters] = useState(() => ({ ...INITIAL_FILTERS, ...initialState?.filters }));
  const [items, setItems] = useState(() => initialState?.items || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(initialState?.notice || '');
  const [nextPageToken, setNextPageToken] = useState(initialState?.nextPageToken || '');
  const [selectedIds, setSelectedIds] = useState(() => initialState?.selectedIds || []);
  const [registrationIds, setRegistrationIds] = useState(() => initialState?.registrationIds || []);
  const [lastQuery, setLastQuery] = useState(initialState?.lastQuery || '');
  const [appliedFilters, setAppliedFilters] = useState(() => initialState?.appliedFilters || null);
  const [sortBy, setSortBy] = useState(() => initialState?.sortBy || 'relevance');
  const [viewFilters, setViewFilters] = useState(() => ({ ...INITIAL_VIEW_FILTERS, ...initialState?.viewFilters }));

  useEffect(() => {
    onStateChange?.({ appliedFilters, filters, items, lastQuery, nextPageToken, notice, registrationIds, selectedIds, sortBy, viewFilters });
  }, [appliedFilters, filters, items, lastQuery, nextPageToken, notice, onStateChange, registrationIds, selectedIds, sortBy, viewFilters]);

  const displayedItems = useMemo(() => sortYoutubeChannelResults(items, sortBy), [items, sortBy]);

  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setNextPageToken('');
  };

  const changeViewFilter = (key, value) => {
    setViewFilters((current) => ({ ...current, [key]: value }));
  };

  const runSearch = async ({ append = false } = {}) => {
    const query = filters.query.trim();
    if (!query) {
      setError('찾고 싶은 채널의 검색 키워드를 입력해 주세요.');
      return false;
    }
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const data = await searchYoutubeChannels({
        q: query,
        maxResults: 25,
        regionCode: filters.regionCode,
        relevanceLanguage: filters.language,
        pageToken: append ? nextPageToken : '',
      });
      if (!data?.success) throw new Error(data?.error || 'YouTube 채널 검색 결과를 불러오지 못했습니다.');
      const incoming = Array.isArray(data.items) ? data.items : [];
      setItems((current) => {
        if (!append) return incoming;
        const merged = new Map(current.map((item) => [item.channelId, item]));
        incoming.forEach((item) => merged.set(item.channelId, item));
        return [...merged.values()];
      });
      if (!append) {
        setSelectedIds([]);
        setRegistrationIds([]);
      }
      if (!append) setAppliedFilters({ ...filters, query });
      setNextPageToken(data.nextPageToken || '');
      setLastQuery(query);
      setNotice(incoming.length > 0
        ? `${incoming.length}개 채널을 찾았습니다. 결과는 아직 등록되지 않았습니다.`
        : '조건에 맞는 채널을 찾지 못했습니다.');
      return true;
    } catch (searchError) {
      setError(searchError.message || 'YouTube 채널 검색 중 오류가 발생했습니다.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleSelected = (channelId) => {
    setSelectedIds((current) => {
      if (current.includes(channelId)) return current.filter((id) => id !== channelId);
      if (current.length >= 4) {
        setNotice('채널 비교는 한 번에 4개까지 선택할 수 있습니다.');
        return current;
      }
      return [...current, channelId];
    });
  };

  const toggleRegistration = (channelId) => {
    setRegistrationIds((current) => {
      const result = toggleYoutubeChannelRegistrationSelection(current, channelId);
      if (result.limitReached) setNotice('등록 후보는 한 번에 최대 50개까지 선택할 수 있습니다.');
      return result.ids;
    });
  };

  const addRegistrationIds = (channelIds) => {
    setRegistrationIds((current) => {
      const result = addYoutubeChannelRegistrationSelections(current, channelIds);
      setNotice(result.limitReached
        ? '등록 후보 50개를 선택했습니다. 나머지 채널은 현재 등록 후보에 포함하지 않았습니다.'
        : `등록 후보 ${result.ids.length}개를 선택했습니다.`);
      return result.ids;
    });
  };

  const clearResults = () => {
    setItems([]);
    setSelectedIds([]);
    setRegistrationIds([]);
    setNextPageToken('');
    setLastQuery('');
    setAppliedFilters(null);
    setSortBy('relevance');
    setViewFilters({ ...INITIAL_VIEW_FILTERS });
    setError('');
    setNotice('임시 채널 검색 결과와 비교·등록 후보 선택을 지웠습니다. 입력한 검색 조건은 그대로 유지됩니다.');
  };

  return {
    appliedFilters,
    addRegistrationIds,
    changeFilter,
    changeSort: setSortBy,
    changeViewFilter,
    clearResults,
    clearSelected: () => setSelectedIds([]),
    clearRegistration: () => setRegistrationIds([]),
    displayedItems,
    error,
    filters,
    items,
    lastQuery,
    loading,
    nextPageToken,
    notice,
    registrationIds,
    runSearch,
    selectedIds,
    sortBy,
    toggleSelected,
    toggleRegistration,
    resetViewFilters: () => setViewFilters(INITIAL_VIEW_FILTERS),
    viewFilters,
  };
}
