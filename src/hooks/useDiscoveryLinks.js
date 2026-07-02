import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDiscoveryLink,
  deleteDiscoveryLink,
  fetchDiscoveryLinks,
  updateDiscoveryLink,
} from '../services/functionApi';

const getDiscoveryLinksFromResponse = (data) => {
  if (Array.isArray(data?.links)) return data.links;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getDiscoveryLinkFromResponse = (data) => {
  return data?.link || data?.item || data?.discoveryLink || null;
};

export function useDiscoveryLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const sortedLinks = useMemo(() => {
    return [...links].sort((left, right) => {
      const leftDate = new Date(left.updatedAt || left.createdAt || 0).getTime();
      const rightDate = new Date(right.updatedAt || right.createdAt || 0).getTime();
      return rightDate - leftDate;
    });
  }, [links]);

  const loadDiscoveryLinks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchDiscoveryLinks();
      if (!data?.success) {
        throw new Error(data?.error || '발견함 링크를 불러오지 못했습니다.');
      }
      setLinks(getDiscoveryLinksFromResponse(data));
    } catch (loadError) {
      setError(loadError.message || 'Cloud 발견함 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiscoveryLinks();
  }, [loadDiscoveryLinks]);

  const addDiscoveryLink = async (payload) => {
    setSaving(true);
    setError('');

    try {
      const data = await createDiscoveryLink(payload);
      if (!data?.success) {
        throw new Error(data?.error || '링크를 저장하지 못했습니다.');
      }

      const createdLink = getDiscoveryLinkFromResponse(data);
      if (createdLink) {
        setLinks((currentLinks) => [
          createdLink,
          ...currentLinks.filter((link) => link.id !== createdLink.id),
        ]);
      } else {
        await loadDiscoveryLinks();
      }

      return true;
    } catch (saveError) {
      setError(saveError.message || 'Cloud에 링크를 저장하지 못했습니다.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const changeDiscoveryLink = async (id, updates) => {
    setSaving(true);
    setError('');

    try {
      const data = await updateDiscoveryLink({ id, updates });
      if (!data?.success) {
        throw new Error(data?.error || '링크 상태를 저장하지 못했습니다.');
      }

      const updatedLink = getDiscoveryLinkFromResponse(data);
      if (updatedLink) {
        setLinks((currentLinks) => currentLinks.map((link) => (
          link.id === updatedLink.id ? updatedLink : link
        )));
      } else {
        await loadDiscoveryLinks();
      }

      return true;
    } catch (saveError) {
      setError(saveError.message || 'Cloud에 링크 상태를 저장하지 못했습니다.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const removeDiscoveryLink = async (id) => {
    setSaving(true);
    setError('');

    try {
      const data = await deleteDiscoveryLink(id);
      if (!data?.success) {
        throw new Error(data?.error || '링크를 삭제하지 못했습니다.');
      }

      setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));
      return true;
    } catch (deleteError) {
      setError(deleteError.message || 'Cloud에서 링크를 삭제하지 못했습니다.');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    discoveryLinks: sortedLinks,
    discoveryLinksError: error,
    discoveryLinksLoading: loading,
    discoveryLinksSaving: saving,
    addDiscoveryLink,
    changeDiscoveryLink,
    loadDiscoveryLinks,
    removeDiscoveryLink,
  };
}
