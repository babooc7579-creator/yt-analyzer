import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createDiscoveryLink,
  deleteDiscoveryLink,
  fetchDiscoveryLinks,
  updateDiscoveryLink,
} from '../services/discoveryLinksApi';
import {
  getDiscoveryLinkFromResponse,
  getDiscoveryLinkById,
  getDiscoveryLinkSavingAction,
  getDiscoveryLinkUpdateNotice,
  getDiscoveryLinksFromResponse,
  removeDiscoveryLinkById,
  replaceDiscoveryLink,
  sortDiscoveryLinksByRecentUpdate,
  upsertDiscoveryLink,
} from '../utils/discoveryLinkCollection';
import {
  DISCOVERY_LINK_DELETE_ACTION_LABEL,
  DISCOVERY_LINK_DELETE_CLOUD_FAILED_MESSAGE,
  DISCOVERY_LINK_DELETE_FAILED_MESSAGE,
  DISCOVERY_LINK_LOAD_FAILED_MESSAGE,
  DISCOVERY_LINK_LOAD_UNAVAILABLE_MESSAGE,
  DISCOVERY_LINK_SAVE_ACTION_LABEL,
  DISCOVERY_LINK_SAVE_CLOUD_FAILED_MESSAGE,
  DISCOVERY_LINK_SAVE_FAILED_MESSAGE,
  DISCOVERY_LINK_STATUS_SAVE_FAILED_MESSAGE,
  DISCOVERY_LINK_UPDATE_ACTION_LABEL,
  DISCOVERY_LINK_UPDATE_CLOUD_FAILED_MESSAGE,
  getDiscoveryActionError,
  getDiscoveryLinkCreatedNotice,
  getDiscoveryLinkDeletedNotice,
  getDiscoveryLinkSavingMessage,
} from '../utils/discoveryLinkActionCopy';

export function useDiscoveryLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [savingAction, setSavingAction] = useState('');

  const sortedLinks = useMemo(() => sortDiscoveryLinksByRecentUpdate(links), [links]);

  const beginSaving = useCallback((action) => {
    setSaving(true);
    setSavingAction(action);
    setError('');
    setNotice('');
  }, []);

  const finishSaving = useCallback(() => {
    setSaving(false);
    setSavingAction('');
  }, []);

  const loadDiscoveryLinks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchDiscoveryLinks();
      if (!data?.success) {
        throw new Error(data?.error || DISCOVERY_LINK_LOAD_FAILED_MESSAGE);
      }
      setLinks(getDiscoveryLinksFromResponse(data));
    } catch (loadError) {
      setError(loadError.message || DISCOVERY_LINK_LOAD_UNAVAILABLE_MESSAGE);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDiscoveryLinks();
  }, [loadDiscoveryLinks]);

  const addDiscoveryLink = async (payload) => {
    beginSaving('create');

    try {
      const data = await createDiscoveryLink(payload);
      if (!data?.success) {
        throw new Error(data?.error || DISCOVERY_LINK_SAVE_FAILED_MESSAGE);
      }

      const createdLink = getDiscoveryLinkFromResponse(data);
      if (createdLink) {
        setLinks((currentLinks) => upsertDiscoveryLink(currentLinks, createdLink));
      } else {
        await loadDiscoveryLinks();
      }

      setNotice(getDiscoveryLinkCreatedNotice(createdLink || payload));
      return true;
    } catch (saveError) {
      setError(getDiscoveryActionError(
        saveError,
        DISCOVERY_LINK_SAVE_CLOUD_FAILED_MESSAGE,
        DISCOVERY_LINK_SAVE_ACTION_LABEL,
      ));
      return false;
    } finally {
      finishSaving();
    }
  };

  const changeDiscoveryLink = async (id, updates) => {
    beginSaving(getDiscoveryLinkSavingAction(updates));
    const currentLink = getDiscoveryLinkById(links, id);

    try {
      const data = await updateDiscoveryLink({ id, updates });
      if (!data?.success) {
        throw new Error(data?.error || DISCOVERY_LINK_STATUS_SAVE_FAILED_MESSAGE);
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
      setError(getDiscoveryActionError(
        saveError,
        DISCOVERY_LINK_UPDATE_CLOUD_FAILED_MESSAGE,
        DISCOVERY_LINK_UPDATE_ACTION_LABEL,
      ));
      return false;
    } finally {
      finishSaving();
    }
  };

  const removeDiscoveryLink = async (id) => {
    beginSaving('delete');
    const currentLink = getDiscoveryLinkById(links, id);

    try {
      const data = await deleteDiscoveryLink(id);
      if (!data?.success) {
        throw new Error(data?.error || DISCOVERY_LINK_DELETE_FAILED_MESSAGE);
      }

      setLinks((currentLinks) => removeDiscoveryLinkById(currentLinks, id));
      setNotice(getDiscoveryLinkDeletedNotice(currentLink));
      return true;
    } catch (deleteError) {
      setError(getDiscoveryActionError(
        deleteError,
        DISCOVERY_LINK_DELETE_CLOUD_FAILED_MESSAGE,
        DISCOVERY_LINK_DELETE_ACTION_LABEL,
      ));
      return false;
    } finally {
      finishSaving();
    }
  };

  return {
    discoveryLinks: sortedLinks,
    discoveryLinksError: error,
    discoveryLinksLoading: loading,
    discoveryLinksNotice: notice,
    discoveryLinksSaving: saving,
    discoveryLinksSavingMessage: getDiscoveryLinkSavingMessage(saving, savingAction),
    addDiscoveryLink,
    changeDiscoveryLink,
    loadDiscoveryLinks,
    removeDiscoveryLink,
  };
}
