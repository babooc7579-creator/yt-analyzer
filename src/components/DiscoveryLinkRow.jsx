import { useState } from 'react';
import {
  DISCOVERY_RIGHTS_TONES,
  getDiscoveryLinkHost,
  getDiscoveryLinkPlatform,
  getDiscoveryLinkStatusLabel,
  getDiscoveryPlatformLabel,
  getDiscoveryRightsStatusLabel,
} from '../constants/discoveryLinks';
import DiscoveryLinkActions from './DiscoveryLinkActions';
import DiscoveryLinkEditForm from './DiscoveryLinkEditForm';

const formatDateTime = (value) => {
  if (!value) return '기록 없음';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '기록 없음';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
};

const needsRiskyCandidateConfirmation = (status, rightsStatus) => (
  status === 'candidate' && rightsStatus === 'do_not_use'
);

const confirmRiskyCandidate = () => window.confirm(
  '이 링크는 "사용 금지"로 표시되어 있습니다.\n\n그래도 제작 후보로 보내시겠어요?\n나중에 제작 후보함에서 강한 경고로 표시됩니다.'
);

export default function DiscoveryLinkRow({
  link,
  onDelete,
  onUpdate,
  saving,
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

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${rightsTone.card}`}>
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2 py-1 text-[10px] font-extrabold text-white">
              {platformLabel}
            </span>
            <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-extrabold text-slate-600">
              출처 {sourceHost}
            </span>
            <span className="rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-extrabold text-indigo-700">
              {getDiscoveryLinkStatusLabel(currentStatus)}
            </span>
            <span className={`rounded-full px-2 py-1 text-[10px] font-extrabold ${rightsTone.badge}`}>
              {getDiscoveryRightsStatusLabel(currentRightsStatus)}
            </span>
          </div>

          {isEditing ? (
            <DiscoveryLinkEditForm
              draftMemo={draftMemo}
              draftTitle={draftTitle}
              linkId={link.id}
              onCancel={cancelEdit}
              onSave={handleSaveEdit}
              saving={saving}
              setDraftMemo={setDraftMemo}
              setDraftTitle={setDraftTitle}
              title={title}
            />
          ) : (
            <>
              <h3 className="mt-3 line-clamp-2 text-base font-extrabold text-slate-950" title={title}>
                {title}
              </h3>
              <p className="mt-1 break-all text-xs text-slate-500">{link.url}</p>
              {link.memo ? (
                <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {link.memo}
                </p>
              ) : null}
            </>
          )}
          <p className="mt-3 text-[11px] font-semibold text-slate-400">
            마지막 저장: {formatDateTime(link.updatedAt || link.createdAt)}
          </p>
        </div>

        <DiscoveryLinkActions
          currentRightsStatus={currentRightsStatus}
          currentStatus={currentStatus}
          isEditing={isEditing}
          link={link}
          onDelete={handleDelete}
          onRightsStatusChange={handleRightsStatusChange}
          onSendToCandidate={handleSendToCandidate}
          onStatusChange={handleStatusChange}
          onToggleEdit={isEditing ? cancelEdit : openEdit}
          saving={saving}
          title={title}
        />
      </div>
    </article>
  );
}
