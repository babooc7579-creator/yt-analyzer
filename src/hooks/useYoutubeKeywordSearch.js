import { useMemo, useState } from 'react';
import { searchYoutubeVideos } from '../services/youtubeSearchApi';
import {
  buildYoutubeSearchOptions,
  filterYoutubeSearchResults,
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

export function useYoutubeKeywordSearch() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [nextPageToken, setNextPageToken] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [lastQuery, setLastQuery] = useState('');

  const displayedItems = useMemo(
    () => filterYoutubeSearchResults(items, filters.minimumViews),
    [filters.minimumViews, items],
  );

  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    if (key !== 'minimumViews') setNextPageToken('');
  };

  const runSearch = async ({ append = false } = {}) => {
    const query = filters.query.trim();
    if (!query) {
      setError('찾고 싶은 영상의 검색 키워드를 입력해 주세요.');
      return false;
    }
    setLoading(true);
    setError('');
    setNotice('');

    try {
      const data = await searchYoutubeVideos(buildYoutubeSearchOptions(filters, append ? nextPageToken : ''));
      if (!data?.success) throw new Error(data?.error || 'YouTube 검색 결과를 불러오지 못했습니다.');
      const incoming = Array.isArray(data.items) ? data.items : [];
      setItems((current) => {
        if (!append) return incoming;
        const merged = new Map(current.map((item) => [item.videoId, item]));
        incoming.forEach((item) => merged.set(item.videoId, item));
        return [...merged.values()];
      });
      if (!append) setSelectedIds([]);
      setNextPageToken(data.nextPageToken || '');
      setLastQuery(query);
      setNotice(incoming.length > 0
        ? `${incoming.length}개 영상을 찾았습니다. 결과는 아직 저장되지 않았습니다.`
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
  const removeSelected = (videoIds) => {
    const removedIds = new Set(videoIds);
    setSelectedIds((current) => current.filter((id) => !removedIds.has(id)));
  };

  return {
    changeFilter,
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
    runSearch,
    selectedIds,
    setNotice,
    toggleSelected,
  };
}
