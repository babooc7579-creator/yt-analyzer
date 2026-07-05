import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDiscoveryLink,
  deleteDiscoveryLink,
  fetchDiscoveryLinks,
  updateDiscoveryLink,
} from '../services/functionApi';
import {
  getDiscoveryLinkFromResponse,
  getDiscoveryLinkById,
  getDiscoveryLinkName,
  getDiscoveryLinkSavingAction,
  getDiscoveryLinkUpdateNotice,
  getDiscoveryLinksFromResponse,
  removeDiscoveryLinkById,
  replaceDiscoveryLink,
  sortDiscoveryLinksByRecentUpdate,
  upsertDiscoveryLink,
} from '../utils/discoveryLinks';

const getDiscoveryActionError = (error, fallbackMessage, actionLabel = '저장') => {
  const message = error?.message || fallbackMessage;
  return `${message} Cloud ${actionLabel} 완료 처리하지 않았습니다. 연결을 확인한 뒤 다시 시도해 주세요.`;
};

export function useDiscoveryLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingAction, setSavingAction] = useState('');

  const sortedLinks = useMemo(() => sortDiscoveryLinksByRecentUpdate(links), [links]);

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
      setError(loadError.message || 'Cloud 발견함 연결에 실패했습니다. Cloud 조회가 성공할 때까지 발견함 목록을 기준 데이터로 보지 않습니다.');
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
        setLinks((currentLinks) => upsertDiscoveryLink(currentLinks, createdLink));
      } else {
        await loadDiscoveryLinks();
      }

      setNotice(`${getDiscoveryLinkName(createdLink || payload)} 링크를 Cloud 발견함에 저장했습니다.`);
      return true;
    } catch (saveError) {
      setError(getDiscoveryActionError(saveError, 'Cloud에 링크를 저장하지 못했습니다.', '저장'));
      return false;
    } finally {
      setSaving(false);
      setSavingAction('');
    }
  };

  const changeDiscoveryLink = async (id, updates) => {
    setSaving(true);
    setSavingAction(getDiscoveryLinkSavingAction(updates));
    setError('');
    setNotice('');
    const currentLink = getDiscoveryLinkById(links, id);

    try {
      const data = await updateDiscoveryLink({ id, updates });
      if (!data?.success) {
        throw new Error(data?.error || '링크 상태를 저장하지 못했습니다.');
      }

      const updatedLink = getDiscoveryLinkFromResponse(data);
      if (updatedLink) {
        setLinks((currentLinks) => replaceDiscoveryLink(currentLinks, updatedLink));
      } else {
        await loadDiscoveryLinks();
      }

      setNotice(getDiscoveryLinkUpdateNotice(updates, updatedLink || { ...currentLink, ...updates }));
      return true;
    } catch (saveError) {
      setError(getDiscoveryActionError(saveError, 'Cloud에 링크 변경 사항을 저장하지 못했습니다.', '변경 저장'));
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
    const currentLink = getDiscoveryLinkById(links, id);

    try {
      const data = await deleteDiscoveryLink(id);
      if (!data?.success) {
        throw new Error(data?.error || '링크를 삭제하지 못했습니다.');
      }

      setLinks((currentLinks) => removeDiscoveryLinkById(currentLinks, id));
      setNotice(`${getDiscoveryLinkName(currentLink)} 링크 기록을 Cloud 발견함에서 삭제했습니다.`);
      return true;
    } catch (deleteError) {
      setError(getDiscoveryActionError(deleteError, 'Cloud에서 링크 기록을 삭제하지 못했습니다.', '삭제'));
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
    delete: 'Cloud 발견함에서 링크 기록을 삭제하는 중입니다.',
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
