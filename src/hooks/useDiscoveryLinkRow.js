import { useState } from 'react';

import {
  DISCOVERY_RIGHTS_TONES,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryPlatformLabel,
} from '../constants/discoveryLinks';

const needsRiskyCandidateConfirmation = (status, rightsStatus) => (
  status === 'candidate' && rightsStatus === 'do_not_use'
);

const confirmRiskyCandidate = () => window.confirm(
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

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
  const currentStatus = link.status || 'inbox';
  const currentRightsStatus = link.rightsStatus || 'unknown';
  const rightsTone = DISCOVERY_RIGHTS_TONES[currentRightsStatus] || DISCOVERY_RIGHTS_TONES.unknown;

  const handleDelete = () => {
    const confirmed = window.confirm(
      '이 발견 링크를 Cloud 발견함에서 삭제할까요?\n\n원본 사이트 게시물이나 외부 링크 자체는 삭제되지 않습니다. Creator OS 안의 발견함 기록만 삭제됩니다.'
    );
    if (confirmed) onDelete(link.id);
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;

    if (needsRiskyCandidateConfirmation(nextStatus, currentRightsStatus) && !confirmRiskyCandidate()) {
      event.target.value = currentStatus;
      return;
    }

    onUpdate(link.id, { status: nextStatus });
  };

  const handleRightsStatusChange = (event) => {
    const nextRightsStatus = event.target.value;

    if (needsRiskyCandidateConfirmation(currentStatus, nextRightsStatus) && !confirmRiskyCandidate()) {
      event.target.value = currentRightsStatus;
      return;
    }

    onUpdate(link.id, { rightsStatus: nextRightsStatus });
  };

  const handleSendToCandidate = () => {
    if (currentStatus === 'candidate') return;

    if (needsRiskyCandidateConfirmation('candidate', currentRightsStatus) && !confirmRiskyCandidate()) {
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
