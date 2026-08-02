import { useState } from 'react';
import { searchYoutubeChannels } from '../services/youtubeSearchApi';

const INITIAL_FILTERS = {
  query: '',
  regionCode: '',
  language: '',
};

export function useYoutubeChannelSearch() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [nextPageToken, setNextPageToken] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [lastQuery, setLastQuery] = useState('');

  const changeFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setNextPageToken('');
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
        maxResults: 12,
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
      if (!append) setSelectedIds([]);
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

  return {
    changeFilter,
    error,
    filters,
    items,
    lastQuery,
    loading,
    nextPageToken,
    notice,
    runSearch,
    selectedIds,
    toggleSelected,
  };
}
