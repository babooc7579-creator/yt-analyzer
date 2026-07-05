import { useState } from 'react';

import {
  DISCOVERY_RIGHTS_TONES,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkRightsStatusValue,
  getDiscoveryLinkStatusValue,
  getDiscoveryPlatformLabel,
} from '../constants/discoveryLinks';
import {
  confirmRiskyDiscoveryCandidate,
  needsRiskyDiscoveryCandidateConfirmation,
} from '../utils/discoveryLinks';

export function useDiscoveryLinkRow({
  link,
  onDelete,
  onUpdate,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(link.title || '');
  const [draftMemo, setDraftMemo] = useState(link.memo || '');
  const title = link.title || getDiscoveryLinkHost(link.url);
  const sourceHost = getDiscoveryLinkHost(link.url);
  const platformLabel = getDiscoveryPlatformLabel(getDiscoveryLinkPlatform(link));
  const currentStatus = getDiscoveryLinkStatusValue(link);
  const currentRightsStatus = getDiscoveryLinkRightsStatusValue(link);
  const rightsTone = DISCOVERY_RIGHTS_TONES[currentRightsStatus] || DISCOVERY_RIGHTS_TONES.unknown;

  const handleDelete = () => {
    const confirmed = window.confirm(
      '이 발견 링크를 Cloud 발견함에서 삭제할까요?\n\n원본 사이트 게시물이나 외부 링크 자체는 삭제되지 않습니다. Creator OS 안의 발견함 기록만 삭제됩니다.'
    );
    if (confirmed) onDelete(link.id);
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;

    if (needsRiskyDiscoveryCandidateConfirmation(nextStatus, currentRightsStatus) && !confirmRiskyDiscoveryCandidate()) {
      event.target.value = currentStatus;
      return;
    }

    onUpdate(link.id, { status: nextStatus });
  };

  const handleRightsStatusChange = (event) => {
    const nextRightsStatus = event.target.value;

    if (needsRiskyDiscoveryCandidateConfirmation(currentStatus, nextRightsStatus) && !confirmRiskyDiscoveryCandidate()) {
      event.target.value = currentRightsStatus;
      return;
    }

    onUpdate(link.id, { rightsStatus: nextRightsStatus });
  };

  const handleSendToCandidate = () => {
    if (currentStatus === 'candidate') return;

    if (needsRiskyDiscoveryCandidateConfirmation('candidate', currentRightsStatus) && !confirmRiskyDiscoveryCandidate()) {
      return;
    }

    onUpdate(link.id, { status: 'candidate' });
  };

  const openEdit = () => {
    setDraftTitle(link.title || '');
    setDraftMemo(link.memo || '');
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraftTitle(link.title || '');
    setDraftMemo(link.memo || '');
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    const nextTitle = draftTitle.trim();
    const nextMemo = draftMemo.trim();

    if (nextTitle === (link.title || '') && nextMemo === (link.memo || '')) {
      setIsEditing(false);
      return;
    }

    const didSave = await onUpdate(link.id, {
      title: nextTitle,
      memo: nextMemo,
    });

    if (didSave) {
      setIsEditing(false);
    }
  };

  return {
    cancelEdit,
    currentRightsStatus,
    currentStatus,
    draftMemo,
    draftTitle,
    handleDelete,
    handleRightsStatusChange,
    handleSaveEdit,
    handleSendToCandidate,
    handleStatusChange,
    isEditing,
    openEdit,
    platformLabel,
    rightsTone,
    setDraftMemo,
    setDraftTitle,
    sourceHost,
    title,
  };
}
