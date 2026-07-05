import { useState } from 'react';

import {
  confirmRiskyDiscoveryCandidate,
  getDiscoveryLinkDraft,
  getDiscoveryLinkDraftUpdates,
  getDiscoveryLinkRowMeta,
  hasDiscoveryLinkDraftChanges,
  needsRiskyDiscoveryCandidateConfirmation,
} from '../utils/discoveryLinks';

export function useDiscoveryLinkRow({
  link,
  onDelete,
  onUpdate,
}) {
  const linkDraft = getDiscoveryLinkDraft(link);
  const rowMeta = getDiscoveryLinkRowMeta(link);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(linkDraft.title);
  const [draftMemo, setDraftMemo] = useState(linkDraft.memo);

  const handleDelete = () => {
    const confirmed = window.confirm(
      '이 발견 링크를 Cloud 발견함에서 삭제할까요?\n\n원본 사이트 게시물이나 외부 링크 자체는 삭제되지 않습니다. Creator OS 안의 발견함 기록만 삭제됩니다.'
    );
    if (confirmed) onDelete(link.id);
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;

    if (needsRiskyDiscoveryCandidateConfirmation(nextStatus, rowMeta.currentRightsStatus) && !confirmRiskyDiscoveryCandidate()) {
      event.target.value = rowMeta.currentStatus;
      return;
    }

    onUpdate(link.id, { status: nextStatus });
  };

  const handleRightsStatusChange = (event) => {
    const nextRightsStatus = event.target.value;

    if (needsRiskyDiscoveryCandidateConfirmation(rowMeta.currentStatus, nextRightsStatus) && !confirmRiskyDiscoveryCandidate()) {
      event.target.value = rowMeta.currentRightsStatus;
      return;
    }

    onUpdate(link.id, { rightsStatus: nextRightsStatus });
  };

  const handleSendToCandidate = () => {
    if (rowMeta.currentStatus === 'candidate') return;

    if (needsRiskyDiscoveryCandidateConfirmation('candidate', rowMeta.currentRightsStatus) && !confirmRiskyDiscoveryCandidate()) {
      return;
    }

    onUpdate(link.id, { status: 'candidate' });
  };

  const openEdit = () => {
    setDraftTitle(linkDraft.title);
    setDraftMemo(linkDraft.memo);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraftTitle(linkDraft.title);
    setDraftMemo(linkDraft.memo);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const draftUpdates = getDiscoveryLinkDraftUpdates(draftTitle, draftMemo);

    if (!hasDiscoveryLinkDraftChanges(link, draftUpdates)) {
      setIsEditing(false);
      return;
    }

    const didSave = await onUpdate(link.id, draftUpdates);

    if (didSave) {
      setIsEditing(false);
    }
  };

  return {
    cancelEdit,
    currentRightsStatus: rowMeta.currentRightsStatus,
    currentStatus: rowMeta.currentStatus,
    draftMemo,
    draftTitle,
    handleDelete,
    handleRightsStatusChange,
    handleSaveEdit,
    handleSendToCandidate,
    handleStatusChange,
    isEditing,
    openEdit,
    platformLabel: rowMeta.platformLabel,
    rightsTone: rowMeta.rightsTone,
    setDraftMemo,
    setDraftTitle,
    sourceHost: rowMeta.sourceHost,
    title: rowMeta.title,
  };
}
