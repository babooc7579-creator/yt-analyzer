import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDiscoveryLink,
  deleteDiscoveryLink,
  fetchDiscoveryLinks,
  updateDiscoveryLink,
} from '../services/functionApi';
import {
  DISCOVERY_LINK_STATUS_OPTIONS,
  DISCOVERY_RIGHTS_STATUS_OPTIONS,
  getDiscoveryLinkHost,
} from '../constants/discoveryLinks';

const getDiscoveryLinksFromResponse = (data) => {
  if (Array.isArray(data?.links)) return data.links;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getDiscoveryLinkFromResponse = (data) => {
  return data?.link || data?.item || data?.discoveryLink || null;
};

const getOptionLabel = (options, value) => (
  options.find((option) => option.value === value)?.label || value || '미지정'
);

const getDiscoveryLinkName = (link) => {
  if (link?.title) return link.title;
  if (link?.url) {
    return getDiscoveryLinkHost(link.url, link.url);
  }
  return '발견 링크';
};

const getSavingActionForUpdates = (updates) => {
  const updateKeys = Object.keys(updates || {});
  if (updateKeys.length === 1 && updateKeys.includes('status')) return 'update_status';
  if (updateKeys.length === 1 && updateKeys.includes('rightsStatus')) return 'update_rights';
  if (updateKeys.length > 0 && updateKeys.every((key) => ['title', 'memo'].includes(key))) return 'update_text';
  return 'update';
};

const getUpdateNotice = (updates, link) => {
  const updateKeys = Object.keys(updates || {});
  const linkName = getDiscoveryLinkName(link);

  if (updateKeys.length === 1 && updates.status !== undefined) {
    const statusLabel = getOptionLabel(DISCOVERY_LINK_STATUS_OPTIONS, updates.status);
    return `${linkName}의 검토 상태를 '${statusLabel}'로 저장했습니다.`;
  }

  if (updateKeys.length === 1 && updates.rightsStatus !== undefined) {
    const rightsLabel = getOptionLabel(DISCOVERY_RIGHTS_STATUS_OPTIONS, updates.rightsStatus);
    return `${linkName}의 권리 확인 상태를 '${rightsLabel}'로 저장했습니다.`;
  }

  if (updateKeys.length > 0 && updateKeys.every((key) => ['title', 'memo'].includes(key))) {
    if (updates.title !== undefined && updates.memo !== undefined) {
      return `${linkName}의 제목과 메모를 Cloud에 저장했습니다.`;
    }
    if (updates.title !== undefined) {
      return `${linkName}의 제목을 Cloud에 저장했습니다.`;
    }
    if (updates.memo !== undefined) {
      return `${linkName}의 메모를 Cloud에 저장했습니다.`;
    }
  }

  return `${linkName}의 변경 사항을 Cloud에 저장했습니다.`;
};

export function useDiscoveryLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingAction, setSavingAction] = useState('');

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
    setSavingAction('create');
    setError('');
    setNotice('');

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

      setNotice(`${getDiscoveryLinkName(createdLink || payload)} 링크를 Cloud 발견함에 저장했습니다.`);
      return true;
    } catch (saveError) {
      setError(saveError.message || 'Cloud에 링크를 저장하지 못했습니다.');
      return false;
    } finally {
      setSaving(false);
      setSavingAction('');
    }
  };

  const changeDiscoveryLink = async (id, updates) => {
    setSaving(true);
    setSavingAction(getSavingActionForUpdates(updates));
    setError('');
    setNotice('');
    const currentLink = links.find((link) => link.id === id);

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

      setNotice(getUpdateNotice(updates, updatedLink || { ...currentLink, ...updates }));
      return true;
    } catch (saveError) {
      setError(saveError.message || 'Cloud에 링크 변경 사항을 저장하지 못했습니다.');
      return false;
    } finally {
      setSaving(false);
      setSavingAction('');
    }
  };

  const removeDiscoveryLink = async (id) => {
    setSaving(true);
    setSavingAction('delete');
    setError('');
    setNotice('');
    const currentLink = links.find((link) => link.id === id);

    try {
      const data = await deleteDiscoveryLink(id);
      if (!data?.success) {
        throw new Error(data?.error || '링크를 삭제하지 못했습니다.');
      }

      setLinks((currentLinks) => currentLinks.filter((link) => link.id !== id));
      setNotice(`${getDiscoveryLinkName(currentLink)} 링크를 Cloud 발견함에서 삭제했습니다.`);
      return true;
    } catch (deleteError) {
      setError(deleteError.message || 'Cloud에서 링크를 삭제하지 못했습니다.');
      return false;
    } finally {
      setSaving(false);
      setSavingAction('');
    }
  };

  const savingMessages = {
    create: '새 발견 링크를 Cloud에 저장하는 중입니다.',
    update: '링크 변경 사항을 Cloud에 저장하는 중입니다.',
    update_status: '검토 상태를 Cloud에 저장하는 중입니다.',
    update_rights: '권리 확인 상태를 Cloud에 저장하는 중입니다.',
    update_text: '제목과 메모를 Cloud에 저장하는 중입니다.',
    delete: 'Cloud 발견함에서 링크를 삭제하는 중입니다.',
  };

  return {
    discoveryLinks: sortedLinks,
    discoveryLinksError: error,
    discoveryLinksLoading: loading,
    discoveryLinksNotice: notice,
    discoveryLinksSaving: saving,
    discoveryLinksSavingMessage: saving ? savingMessages[savingAction] || '' : '',
    addDiscoveryLink,
    changeDiscoveryLink,
    loadDiscoveryLinks,
    removeDiscoveryLink,
  };
}
